import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
});

export const Footer = () => {
  return (
    <footer className="border-t font-medium bg-white pt-1">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center gap-2 h-full px-4 py-6 lg:px-12">
        <p>Powered by</p>
        <Link href={'/'}>
          <span className={cn('font-semibold text-2xl', poppins.className)}>funroad</span>
        </Link>
      </div>
    </footer>
  );
};
