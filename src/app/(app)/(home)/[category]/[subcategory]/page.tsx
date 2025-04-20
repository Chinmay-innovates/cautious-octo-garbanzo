import { SearchParams } from 'nuqs/server';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

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
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: subcategorySlug,
      ...filters,
    }),
  );
  return (
    <HydrateClient>
      <ProductListView categorySlug={subcategorySlug} />
    </HydrateClient>
  );
};

export default Page;
