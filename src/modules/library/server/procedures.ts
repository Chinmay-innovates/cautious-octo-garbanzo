import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { Media, Tenant } from '@/payload-types';
import { DEFAULT_LIMIT } from '@/constants';

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: 'orders',
        depth: 0, // Gets only ids with out populating
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user?.id,
          },
        },
      });

      const productIds = data.docs.map((doc) => doc.product).filter(Boolean);

      // Return early if no product IDs found
      if (productIds.length === 0) {
        return {
          docs: [],
          hasNextPage: false,
          nextPage: undefined,
        };
      }

      const productsData = await ctx.db.find({
        collection: 'products',
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      return {
        ...productsData,
        docs: productsData.docs
          .map((doc) => ({
            ...doc,
            image: doc.image as Media | null,
            tenant: doc.tenant as Tenant & {
              image: Media | null;
            },
          }))
          .sort((a, b) => a.name.localeCompare(b.name)), // Sort by product name
      };
    }),
});
