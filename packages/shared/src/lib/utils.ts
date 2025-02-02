import type { PaginationRes } from '../types/index';

export const generateArray = (length: number) => {
  if (!length) throw new Error('"length" parameter is required');
  return Array.from(Array(length).keys());
};

export const startCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .replace(/[_-]+/g, ' ') // Replace underscores and hyphens with space
    .replace(/([a-zA-Z0-9]+)/g, (match) => {
      return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(); // Capitalize first letter of each word
    })
    .trim(); // Trim any leading or trailing whitespace
};

export const lowerCase = (str: string): string => {
  return (
    str
      // Split on word boundaries and transitions between lowercase and uppercase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .match(/[A-Za-z0-9]+/g)
      ?.map((word) => word.toLowerCase())
      .join(' ') || ''
  );
};

export const toQueryString = (
  params: Record<
    string,
    string | number | boolean | (string | number | boolean)[] | undefined
  >
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return; // Skip undefined and empty string values
    }
    if (Array.isArray(value)) {
      // Append array values
      value.forEach((val) => searchParams.append(key, val.toString()));
    } else {
      // Append single value
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const createPagination = ({
  page,
  limit,
  totalCount,
}: {
  page: number;
  limit: number;
  totalCount: number;
}): PaginationRes => {
  const pageCount = Math.ceil(totalCount / limit);

  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;
  const currentPage = page;
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < pageCount ? page + 1 : null;

  return {
    isFirstPage,
    isLastPage,
    currentPage,
    previousPage,
    nextPage,
    totalCount,
    pageCount,
  };
};
