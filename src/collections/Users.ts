import type { CollectionConfig } from 'payload';
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields';

const defaultTenantArrayFeild = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
});
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: 'user',
      hasMany: true,
      options: ['super-admin', 'user'],
    },
    {
      ...defaultTenantArrayFeild,
      admin: {
        ...(defaultTenantArrayFeild?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
};
