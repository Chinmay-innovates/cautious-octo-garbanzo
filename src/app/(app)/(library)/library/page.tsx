import { DEFAULT_LIMIT } from '@/constants';
import { LibraryView } from '@/modules/library/ui/views/library-view';
import { getQueryClient, HydrateClient, trpc } from '@/trpc/server';

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT }),
  );
  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
};

export default Page;
