'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  useParams as useNextParams,
  usePathname as useNextPathname,
} from 'next/navigation';

export const useCurrentOrganizationId = () => {
  const params = useNextParams<{ organizationId: string }>();

  return params.organizationId;
};

export const useCustomPathname = (): string => {
  const pathname = useNextPathname();

  const modifiedPathname = useMemo(() => {
    if (!pathname) return '/'; // Return root if no pathname
    const segments = pathname.split('/').filter(Boolean); // Split and filter empty segments
    if (segments.length <= 1) return '/'; // If only the organization exists, return root
    return `/${segments.slice(1).join('/')}`; // Remove the first segment and join the rest
  }, [pathname]);

  return modifiedPathname;
};

export const CustomLink = ({
  children,
  href,
  ...rest
}: React.PropsWithChildren<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>) => {
  const currentOrganizationId = useCurrentOrganizationId();

  return (
    <Link href={`/${currentOrganizationId}${href}`} {...rest}>
      {children}
    </Link>
  );
};
