import type { SearchParams } from 'nuqs/server';

import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';

import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_LIMIT } from '@/constants';

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrateClient>
  );
};

export default Page;
