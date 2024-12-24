import { auth } from '@repo/auth/server';
import { Context } from 'elysia';

const betterAuthView = (context: Context) => {
  console.log('RUNSSSSSSSSSS');
  const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    console.log(context.request);
    auth.handler(context.request);
  }

  return context.error(405);
};

export default betterAuthView;
