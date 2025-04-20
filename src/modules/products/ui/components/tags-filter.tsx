import { LoaderIcon } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ onChange, value }: Props) => {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.tags.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      },
    ),
  );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };
  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              onClick={() => onClick(tag.name)}
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <button
          className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? <LoaderIcon className="size-4 animate-spin" /> : 'Load more...'}
          {/* Load more... */}
        </button>
      )}
    </div>
  );
};
