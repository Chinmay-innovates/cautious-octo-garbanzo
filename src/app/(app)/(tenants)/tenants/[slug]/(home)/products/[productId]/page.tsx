import { ProductView } from '@/modules/products/ui/views/product-view';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}
const Page = async ({ params }: Props) => {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    }),
  );

  return (
    <HydrateClient>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrateClient>
  );
};

export default Page;
