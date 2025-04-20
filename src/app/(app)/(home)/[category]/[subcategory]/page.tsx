import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/product-list';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';
interface Props {
  params: Promise<{
    subcategory: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { subcategory: subcategorySlug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: subcategorySlug,
    }),
  );
  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList categorySlug={subcategorySlug} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
