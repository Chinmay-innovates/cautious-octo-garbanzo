import { z } from 'zod';
import { BasePayload } from 'payload';
import { TRPCError } from '@trpc/server';
import { headers as getHeaders, cookies as getCookies } from 'next/headers';

import { AUTH_COOKIE } from '../constants';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { loginSchema, registerSchema } from '../schemas';

type Context = {
  db: BasePayload;
};

async function createSession(ctx: Context, email: string, password: string) {
  const data = await ctx.db.login({
    collection: 'users',
    data: { email, password },
  });

  if (!data.token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid credentials',
    });
  }

  const cookies = await getCookies();
  cookies.set({
    name: AUTH_COOKIE,
    value: data.token,
    httpOnly: true,
    path: '/',
    // TODO: Ensure cross-site cookie sharing
    // sameSite: "none",
    // domain:""
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return data;
}

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),
  register: baseProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.find({
      collection: 'users',
      limit: 1,
      where: {
        username: {
          equals: input.username,
        },
      },
    });
    const existingUser = data.docs[0];
    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Username already taken',
      });
    }
    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        username: input.username,
        password: input.password, //This is hashed by payload
      },
    });

    await createSession(ctx, input.email, input.password);
  }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    return await createSession(ctx, input.email, input.password);
  }),
});
