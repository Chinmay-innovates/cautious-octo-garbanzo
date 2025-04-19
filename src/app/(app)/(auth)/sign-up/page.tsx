import { redirect } from 'next/navigation';
import { caller } from '@/trpc/server';
import { SignUpView } from '@/modules/auth/ui/views/sign-up-view';

const Page = async () => {
  const session = await caller.auth.session();

  if (session) redirect('/');

  return <SignUpView />;
};

export default Page;
