import { createTRPCRouter } from '../init';
import { authRouter } from '@/modules/auth/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productsRouter,
  auth: authRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
