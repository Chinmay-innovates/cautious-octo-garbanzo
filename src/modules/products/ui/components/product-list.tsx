'use client';

import { useTRPC } from '@/trpc/client';
import { useProductFilters } from '@/modules/products/hooks/use-product-filters';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { ProductCard, ProductCardSkeleton } from './product-card';
import { DEFAULT_LIMIT } from '@/constants';
import { Button } from '@/components/ui/button';
import { InboxIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  categorySlug?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}
export const ProductList = ({ categorySlug, tenantSlug, narrowView }: Props) => {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      {
        ...filters,
        tenantSlug,
        categorySlug,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex justify-center items-center p-8 flex-col gap-y-4 bg-white rounded-lg">
        <InboxIcon size={30} />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4',
          narrowView && 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3',
        )}
      >
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantImageUrl={product.tenant.image?.url}
              price={product.price}
              reviewRating={3}
              reviewCount={5.0}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant={'elevated'}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = ({ narrowView }: Props) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4',
        narrowView && 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3',
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
