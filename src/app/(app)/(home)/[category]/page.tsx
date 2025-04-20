import { ProductList, ProductListSkeleton } from '@/modules/products/ui/components/product-list';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';
import { Suspense } from 'react';
interface Props {
  params: Promise<{
    category: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { category: categorySlug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
    }),
  );
  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList categorySlug={categorySlug} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
