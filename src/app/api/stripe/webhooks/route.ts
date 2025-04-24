import type Stripe from 'stripe';
import { getPayload } from 'payload';
import config from '@payload-config';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { ExpandedLineItem } from '@/modules/checkout/types';

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (error! instanceof Error) {
      console.error(error);
    }
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
  }

  console.log(`✅ Success: ${event.id}`);

  const permittedEvents: Stripe.Event.Type[] = ['checkout.session.completed'];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            throw new Error('User ID is required');
          }
          const user = await payload.findByID({
            collection: 'users',
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error('User not found');
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(data.id, {
            expand: ['line_items.data.price.product'],
          });

          if (!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
            throw new Error('Line items not found');
          }

          const lineItems = expandedSession.line_items.data as ExpandedLineItem[];

          for (const item of lineItems) {
            await payload.create({
              collection: 'orders',
              data: {
                name: item.price.product.name,
                user: user.id,
                product: item.price.product.metadata.id,
                stripeCheckoutSessionId: data.id,
              },
            });
          }

          break;

        default:
          throw new Error(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'Webhook handler failed' }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
