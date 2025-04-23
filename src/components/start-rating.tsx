import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

const MAX_RATING = 5;
const MIN_RATING = 0;

interface Props {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}
export const StartRating = ({ rating, className, iconClassName, text }: Props) => {
  const safeRating = Math.max(Math.min(rating, MAX_RATING), MIN_RATING);
  return (
    <div className={cn('flex items-center gap-x-1', className)}>
      {Array.from({ length: MAX_RATING }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            'size-4',
            index < safeRating ? 'fill-amber-400' : 'text-gray-400',
            iconClassName,
          )}
        />
      ))}
    </div>
  );
};
