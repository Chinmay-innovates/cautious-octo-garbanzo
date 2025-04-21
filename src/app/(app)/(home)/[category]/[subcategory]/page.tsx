import { SearchParams } from 'nuqs/server';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_LIMIT } from '@/constants';

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { subcategory: subcategorySlug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      categorySlug: subcategorySlug,
      limit: DEFAULT_LIMIT,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView categorySlug={subcategorySlug} />
    </HydrateClient>
  );
};

export default Page;
