import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Sort, Where } from 'payload';
import { Category } from '@/payload-types';
import { sortValues } from '../search-params';
export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().optional().nullable(),
        minPrice: z.string().optional().nullable(),
        maxPrice: z.string().optional().nullable(),
        tags: z.array(z.string()).optional().nullable(),
        sort: z.enum(sortValues).optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = '-createdAt';

      if (input.sort === 'curated') {
        sort = '-createdAt';
      }

      if (input.sort === 'trending') {
        sort = '+createdAt';
      }

      if (input.sort === 'hot_and_new') {
        sort = '-createdAt';
      }

      const parsePrice = (value: string | null | undefined) => {
        if (!value) return undefined;
        const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
        return isNaN(numeric) ? undefined : numeric;
      };

      const min = parsePrice(input.minPrice);
      const max = parsePrice(input.maxPrice);

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: min,
          less_than_equal: max,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: min,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: max,
        };
      }

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

      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: 'products',
        depth: 1, // Populate "category", "image"
        where,
        sort,
      });

      return data;
    }),
});
