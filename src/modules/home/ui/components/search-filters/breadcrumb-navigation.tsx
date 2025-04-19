import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface Props {
  categorySlug?: string | null;
  activeCategoryName?: string | null;
  activeSubcategoryName?: string | null;
}

export const BreadcrumbNavigation = ({
  categorySlug,
  activeCategoryName,
  activeSubcategoryName,
}: Props) => {
  if (!activeCategoryName || categorySlug === 'all') return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-xl font-medium underline text-primary">
                <Link href={`/${categorySlug}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium text-lg">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-medium">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl font-medium">{activeCategoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
