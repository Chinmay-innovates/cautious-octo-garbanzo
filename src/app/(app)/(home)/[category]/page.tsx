import { Suspense } from 'react';
import type { SearchParams } from 'nuqs/server';

import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';

import { loadProductFilters } from '@/modules/products/search-params';
import { ProductSort } from '@/modules/products/ui/components/product-sort';
import { ProductFilters } from '@/modules/products/ui/components/product-filters';
import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/product-list';

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}
const Page = async ({ params, searchParams }: Props) => {
  const { category: categorySlug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
      ...filters,
    }),
  );
  return (
    <HydrateClient>
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList categorySlug={categorySlug} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
