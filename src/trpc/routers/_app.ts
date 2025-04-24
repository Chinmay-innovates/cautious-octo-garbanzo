import { createTRPCRouter } from '../init';

import { authRouter } from '@/modules/auth/server/procedures';
import { tagsRouter } from '@/modules/tags/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { tenantsRouter } from '@/modules/tenants/server/procedures';
import { libraryRouter } from '@/modules/library/server/procedures';
import { checkoutRouter } from '@/modules/checkout/server/procedures';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productsRouter,
  tenants: tenantsRouter,
  library: libraryRouter,
  checkout: checkoutRouter,
  auth: authRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
