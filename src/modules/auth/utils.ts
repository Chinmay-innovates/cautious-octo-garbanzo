import { cookies as getCookies } from 'next/headers';

interface Props {
  prefix: string;
  value: string;
}
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
};
