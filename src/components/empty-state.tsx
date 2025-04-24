import { InboxIcon, LoaderIcon, type LucideIcon } from 'lucide-react';

type EmptyStateType = 'text' | 'loader';
interface Props {
  message?: string;
  icon?: LucideIcon;
  type?: EmptyStateType;
}

export const EmptyState = ({
  icon: Icon = InboxIcon,
  message = 'No products found',
  type = 'text',
}: Props) => {
  return (
    <div className="border border-black border-dashed flex justify-center items-center p-8 flex-col gap-y-4 bg-white rounded-lg">
      {type === 'loader' ? (
        <LoaderIcon className="text-muted-foreground animate-spin" />
      ) : (
        <>
          <Icon size={30} />
          <p className="text-base font-medium text-muted-foreground">{message}</p>
        </>
      )}
    </div>
  );
};
