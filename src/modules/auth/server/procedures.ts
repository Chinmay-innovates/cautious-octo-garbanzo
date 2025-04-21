import { BasePayload } from 'payload';
import { TRPCError } from '@trpc/server';
import { headers as getHeaders } from 'next/headers';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { loginSchema, registerSchema } from '../schemas';
import { generateAuthCookie } from '../utils';

type Context = {
  db: BasePayload;
};

async function createSession(ctx: Context, email: string, password: string) {
  const data = await ctx.db.login({
    collection: 'users',
    data: { email, password },
  });

  if (!data.token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid credentials',
    });
  }

  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token,
  });

  return data;
}

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.find({
      collection: 'users',
      limit: 1,
      where: {
        username: {
          equals: input.username,
        },
      },
    });
    const existingUser = data.docs[0];
    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Username already taken',
      });
    }

    const tenant = await ctx.db.create({
      collection: 'tenants',
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: 'test',
      },
    });

    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        username: input.username,
        password: input.password, //This is hashed by payload
        tenants: [
          {
            tenant: tenant.id,
          },
        ],
      },
    });

    await createSession(ctx, input.email, input.password);
  }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    return await createSession(ctx, input.email, input.password);
  }),
});
