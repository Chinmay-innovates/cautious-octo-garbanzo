import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Where } from 'payload';
import { Category } from '@/payload-types';
export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.categorySlug) {
        const categoryData = await ctx.db.find({
          collection: 'categories',
          limit: 1,
          depth: 1, // Populate "subcategories"
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            },
          },
        });

        const formattedData = categoryData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // due to "depth: 1" above, this is always a Category
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const subcategorySlugs = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategorySlugs.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug),
          );

          where['category.slug'] = {
            in: [...subcategorySlugs, input.categorySlug],
          };
        }
      }
      const data = await ctx.db.find({
        collection: 'products',
        depth: 1, // Populate "category", "image"
        where,
      });

      return data;
    }),
});
