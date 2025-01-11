'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CategoryGetAll, categoryService } from '@/services/category.service';
import { useDebouncedValue } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DataTable } from '@/components/table/data-table';
import InputSearch from '@/components/table/input-search';
import { buttonVariants } from '@/components/ui/button';

const columnHelper = createColumnHelper<CategoryGetAll>();

const columns = [
  columnHelper.accessor('title', {
    header: () => 'Title',
    cell: (info) => (
      <span className='font-medium text-primary'>{info.renderValue()}</span>
    ),
  }),
  columnHelper.accessor('slug', {
    header: () => 'Slug',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Created At',
    cell: (info) => {
      console.log('info =>', info.row.original);
      return info.renderValue()?.getFullYear();
    },
  }),
];

const searchByOptions = [
  { value: 'title', label: 'Title' },
  { value: 'slug', label: 'Slug' },
];

export default function Page() {
  const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyDebounce] = useDebouncedValue(searchKey, 500);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // const categoriesQuery = trpcClient.category.getAll.useQuery(
  //   { page: pageIndex + 1, limit: pageSize, [searchBy]: searchKeyDebounce },
  //   {
  //     placeholderData: keepPreviousData,
  //   }
  // );

  const query = {
    page: pageIndex + 1,
    limit: pageSize,
    [searchBy]: searchKeyDebounce,
  };

  const categoriesQuery = useQuery({
    queryKey: ['categories', query],
    queryFn: categoryService.getAll,
    placeholderData: keepPreviousData,
  });

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: categoriesQuery.data ?? defaultData,
    columns,
    // pageCount: categoriesQuery.data?.pagination?.pageCount ?? -1,
    pageCount: -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    columnResizeMode: 'onChange',
    renderFallbackValue: '-',
    meta: {},
  });

  return (
    <main>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='mb-4 text-3xl font-bold'>Categories</h2>

        <div>
          <Link href='/categories/add' className={cn(buttonVariants())}>
            <PlusIcon className='size-4' /> <span>Add Category</span>
          </Link>
        </div>
      </div>
      <div className='flex items-center gap-4 py-4'>
        <InputSearch
          searchBy={searchBy}
          searchKey={searchKey}
          options={searchByOptions}
          onSelectChange={setSearchBy}
          onInputChange={(e) => {
            setSearchKey(e.target.value); //! set searchKey (debounce)
            //! reset pageIndex to "0"
            setPagination((current) => ({
              ...current,
              pageIndex: 0,
            }));
          }}
        />

        {/* <ColumnVisibilityDropdown tableInstance={table} /> */}
      </div>
      <DataTable tableInstance={table} />
    </main>
  );
}
