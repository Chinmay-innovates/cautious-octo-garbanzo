'use client';
import { useTRPC } from '@/trpc/client';
import { useParams } from 'next/navigation';

import { useSuspenseQuery } from '@tanstack/react-query';
import { DEFAULT_BG_COLOR } from '@/modules/home/constants';

import { Categories } from './categories';
import { SearchInput } from './search-input';
import { BreadcrumbNavigation } from './breadcrumb-navigation';

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const params = useParams();

  const categorySlug = params.category as string | undefined;
  const activeCategory = data.find((category) => category.slug === categorySlug);
  const activeCategoryColor = activeCategory?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategory?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategory?.subcategories.find((subcategory) => subcategory.slug === activeSubcategory)
      ?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-y-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        categorySlug={categorySlug}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-y-4 w-full"
      style={{
        backgroundColor: '#F5F5F5',
      }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
