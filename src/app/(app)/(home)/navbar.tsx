'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavbarSidebar } from './navbar-sidebar';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
});

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}
const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant={'outline'}
      className={cn(
        'bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg',
        isActive && 'bg-black text-white hover:bg-black hover:text-white',
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: '/', children: 'Home' },
  { href: '/about', children: 'About' },
  { href: '/features', children: 'Features' },
  { href: '/pricing', children: 'Pricing' },
  { href: '/contact', children: 'Contact' },
];
export const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href={'/'} className="pl-6 flex items-center">
        <span className={cn('font-semibold text-5xl', poppins.className)}>funroad</span>
      </Link>
      <NavbarSidebar open={open} onOpenChange={setOpen} items={navbarItems} />
      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem key={item.href} href={item.href} isActive={pathname === item.href}>
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {session.data?.user ? (
        <div className="hidden lg:flex">
          <NavButton href="/admin" variant="black" children="Dashboard" />
        </div>
      ) : (
        <div className="hidden lg:flex">
          <NavButton href="/sign-in" prefetch children="Log in" />
          <NavButton href="/sign-up" variant="black" prefetch children="Start selling" />
        </div>
      )}
      <div className="flex lg:hidden items-center pr-3">
        <Button
          variant={'ghost'}
          className="size-12 border-transparent bg-white"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

const NavButton = ({
  href,
  children,
  variant = 'default',
  prefetch = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'black';
  prefetch?: boolean;
}) => {
  const base =
    'border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none transition-colors text-lg';

  const variants = {
    default: 'bg-white text-black hover:bg-pink-400',
    black: 'bg-black text-white hover:text-black hover:bg-pink-400',
  };

  return (
    <Button asChild className={cn(base, variants[variant])}>
      <Link prefetch={prefetch} href={href}>
        {children}
      </Link>
    </Button>
  );
};
