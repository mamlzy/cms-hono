import { NextResponse, type NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import type { Session } from '@repo/auth/server';
import type { Organization } from '@repo/db/schema';

export async function middleware(req: NextRequest) {
  console.log('⚡ Middleware runs ⚡');

  const response = NextResponse.next();

  const { pathname: fullPathname } = req.nextUrl;

  let session: Session | null = null;
  const authRoutes = ['/login'];
  const publicRoutes = ['/test'];

  const isAuthRoute = authRoutes.includes(fullPathname);
  const isProtectedRoutes =
    !isAuthRoute && !publicRoutes.includes(fullPathname);
  const isOrgRoute = fullPathname === '/organization';

  try {
    const { data: sessionResponse, error } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          // get the cookie from the request
          cookie: req.headers.get('cookie') || '',
        },
      }
    );

    if (!error) {
      session = sessionResponse;
    }
  } catch (err) {
    console.log('err =>', err);
  }

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isProtectedRoutes) {
    if (!session?.session || !session?.user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const { activeOrganizationId } = session.session;

    if (isOrgRoute) {
      return response;
    }

    if (fullPathname === '/') {
      if (!activeOrganizationId) {
        return NextResponse.redirect(new URL(`/organization`, req.url));
      }

      const organization = await getOrganizationById(req, activeOrganizationId);

      if (!organization) {
        return NextResponse.redirect(new URL(`/organization`, req.url));
      }

      return NextResponse.redirect(
        new URL(`/${organization.id}/dashboard`, req.url)
      );
    }

    // Match the organization URL pattern
    const organizationMatch = fullPathname.match(/^\/([^/]+)(\/.*)?/);
    const organizationId = organizationMatch ? organizationMatch[1] : null;

    const isValidOrg = await getValidOrganization({ req, organizationId });

    if (!isValidOrg) {
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }

    if (!activeOrganizationId) {
      return NextResponse.redirect(new URL('/organization', req.url));
    }

    /*
     * if activeOrganizationId not equal to current organization page,
     * set active organization to current organization page
     */
    if (activeOrganizationId !== organizationId) {
      await betterFetch<Organization>('/api/auth/organization/set-active', {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        method: 'POST',
        headers: {
          // get the cookie from the request
          cookie: req.headers.get('cookie') || '',
        },
        body: {
          organizationId,
        },
      });
    }
  }

  return response;
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
    // '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|sitemap\\.xml|robots\\.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

async function getOrganizationById(
  req: NextRequest,
  organizationId: string | null
) {
  if (!organizationId) return false;

  const { data } = await betterFetch<{ data: Organization }>(
    `/api/organizations/id/${organizationId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    }
  );

  return data?.data;
}

async function getValidOrganization({
  req,
  organizationId,
}: {
  req: NextRequest;
  organizationId: string | null;
}) {
  if (!organizationId) return false;

  const { data } = await betterFetch<{ data: Organization }>(
    `/api/organizations/id/${organizationId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    }
  );

  return data?.data;
}
