import { z } from 'zod';
import { Sort, Where } from 'payload';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Category, Media, Tenant } from '@/payload-types';
import { sortValues } from '../search-params';
import { DEFAULT_LIMIT } from '@/constants';

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        categorySlug: z.string().optional().nullable(),
        minPrice: z.string().optional().nullable(),
        maxPrice: z.string().optional().nullable(),
        tags: z.array(z.string()).optional().nullable(),
        sort: z.enum(sortValues).optional().nullable(),
        tenantSlug: z.string().optional().nullable(),
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

      if (input.tenantSlug) {
        where['tenant.slug'] = {
          equals: input.tenantSlug,
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
        depth: 2, // Populate "category", "image" , and "tenant" & "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & {
            image: Media | null;
          },
        })),
      };
    }),
});
