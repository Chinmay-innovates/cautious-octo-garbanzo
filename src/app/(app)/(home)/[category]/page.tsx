import type { SearchParams } from 'nuqs/server';

import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';

import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_LIMIT } from '@/constants';

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
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      categorySlug,
      limit: DEFAULT_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView categorySlug={categorySlug} />
    </HydrateClient>
  );
};

export default Page;
