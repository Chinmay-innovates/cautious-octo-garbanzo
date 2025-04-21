import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Store Name',
      admin: {
        description: "This is the name of your store(e.g. John's Store)",
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      required: true,
      admin: {
        description: 'This is the subdmoin of your store(e.g. [slug].funroad.com)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      admin: {
        readOnly: true,
        description: 'Yu cannot create products until you submit your Stripe details',
      },
    },
  ],
};
