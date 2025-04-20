'use client';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Props {
  categorySlug?: string;
}
export const ProductList = ({ categorySlug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug,
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
