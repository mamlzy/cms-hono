'use client';

import { useMemo, useState } from 'react';
import { faqRequest, type FaqGetAll } from '@/requests/faq.request';
import { useDebouncedValue } from '@mantine/hooks';
import type { QueryFaqSchema } from '@repo/shared/schemas';
import type { Option, ToQueryString } from '@repo/shared/types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

import { CustomLink, useCurrentOrganizationId } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/table/data-table';
import InputSearch from '@/components/table/input-search';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columnHelper = createColumnHelper<FaqGetAll>();

const columns = [
  columnHelper.accessor('title', {
    header: () => 'Title',
    cell: (info) => (
      <span className='text-xl font-bold text-primary'>
        {info.renderValue()}
      </span>
    ),
  }),
  columnHelper.accessor('description', {
    header: () => 'Description',
    cell: (info) => (
      <span className='line-clamp-3 text-sm'>{info.renderValue()}</span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    meta: {
      width: '0%',
    },
    cell: (info) => {
      const qc = useQueryClient();
      const [showConfirmationDialog, setshowConfirmationDialog] =
        useState(false);

      const { id } = info.row.original;

      const deleteFaqMutation = useMutation({
        mutationFn: faqRequest.deleteById,
      });

      const handleDelete = () => {
        toast.promise(deleteFaqMutation.mutateAsync(id), {
          loading: 'Loading...',
          success: () => {
            qc.invalidateQueries({ queryKey: ['faqs'] });

            return `Faq deleted.`;
          },
          error: (err) => {
            console.log('err =>', err);
            return `Error, ${err.message}`;
          },
        });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='hover:bg-primary/10'
              >
                <EllipsisVerticalIcon
                  strokeWidth={2.5}
                  className='!size-5 text-muted-foreground'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              sideOffset={0}
              className='font-normal'
            >
              <DropdownMenuItem asChild>
                <CustomLink href={`/faq/${id}`}>
                  <PencilIcon className='mr-2' />
                  Edit
                </CustomLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setshowConfirmationDialog(true)}>
                <Trash2Icon className='mr-2' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={showConfirmationDialog}
            onOpenChange={setshowConfirmationDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  }),
];

const searchByOptions = [{ value: 'title', label: 'Title' }] satisfies Option<
  keyof QueryFaqSchema
>[];

export default function Page() {
  const currentOrganizationId = useCurrentOrganizationId();

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

  const query: ToQueryString<QueryFaqSchema> = {
    page: (pageIndex + 1).toString(),
    limit: pageSize.toString(),
    organizationId: currentOrganizationId,
    [searchBy]: searchKeyDebounce || undefined,
  };

  const faqsQuery = useQuery({
    enabled: !!currentOrganizationId,
    queryKey: ['faqs', query],
    queryFn: () => faqRequest.getAll(query),
    placeholderData: keepPreviousData,
  });

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: faqsQuery.data?.data ?? defaultData,
    columns,
    pageCount: faqsQuery.data?.pagination?.pageCount ?? -1,
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
    <>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='mb-4 text-3xl font-bold'>Faqs</h2>

        <div>
          <CustomLink href='/faq/create' className={cn(buttonVariants())}>
            <PlusIcon className='size-4' /> <span>New Faq</span>
          </CustomLink>
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
    </>
  );
}
