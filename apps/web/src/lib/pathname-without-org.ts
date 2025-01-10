export const pathnameWithoutOrg = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean); // Split by '/' and remove empty segments
  return `/${segments.slice(1).join('/')}`; // Skip the first segment and join the rest
};
