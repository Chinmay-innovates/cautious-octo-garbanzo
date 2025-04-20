'use client';

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
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};
