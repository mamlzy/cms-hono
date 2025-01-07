import type { NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import type { auth } from '@repo/auth/server';

type Session = typeof auth.$Infer.Session;

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('⚡ Middleware runs ⚡');
  console.log(
    'process.env.NEXT_PUBLIC_API_BASE_URL =>',
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
  try {
    const { data: session } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          // get the cookie from the request
          cookie: request.headers.get('cookie') || '',
        },
      }
    );
    console.log('session =>', session);
  } catch (err) {
    console.log('err =>', err);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
