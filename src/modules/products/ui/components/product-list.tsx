'use client';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useProductFilters } from '@/modules/products/hooks/use-product-filters';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  categorySlug?: string;
}
export const ProductList = ({ categorySlug }: Props) => {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
      ...filters,
    }),
  );
  return (
    <Card>
      {data.docs.map((product) => (
        <div key={product.id} className="p-2 border-b last:border-b-0">
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="text-xl">{product.description}</CardDescription>
          <p className="text-gray-500">$ {product.price}</p>
        </div>
      ))}
    </Card>
  );
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};
