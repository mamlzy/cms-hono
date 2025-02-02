'use client';

import { useMemo, useState } from 'react';
import { postRequest, type PostGetAll } from '@/requests/post.request';
import { useDebouncedValue } from '@mantine/hooks';
import type { QueryPostSchema } from '@repo/shared/schemas';
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
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const columnHelper = createColumnHelper<PostGetAll>();

const columns = [
  columnHelper.accessor('title', {
    header: () => 'Title',
    meta: {
      width: '80%',
    },
    cell: (info) => (
      <span className='text-xl font-bold text-primary'>
        {info.renderValue()}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: (info) => {
      const status = info.getValue();

      return status === 'PUBLISHED' ? (
        <Badge>Published</Badge>
      ) : (
        <Badge variant='destructive'>Draft</Badge>
      );
    },
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

      const deletePostMutation = useMutation({
        mutationFn: postRequest.deleteById,
      });

      const handleDelete = () => {
        toast.promise(deletePostMutation.mutateAsync(id), {
          loading: 'Loading...',
          success: () => {
            qc.invalidateQueries({ queryKey: ['posts'] });
            qc.invalidateQueries({ queryKey: ['medias'] });

            return `Post deleted.`;
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
                <CustomLink href={`/post/${id}`}>
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
  keyof QueryPostSchema
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

  const query: ToQueryString<QueryPostSchema> = {
    page: (pageIndex + 1).toString(),
    limit: pageSize.toString(),
    organizationId: currentOrganizationId,
    [searchBy]: searchKeyDebounce || undefined,
  };

  const postsQuery = useQuery({
    enabled: !!currentOrganizationId,
    queryKey: ['posts', query],
    queryFn: () => postRequest.getAll(query),
    placeholderData: keepPreviousData,
  });

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: postsQuery.data?.data ?? defaultData,
    columns,
    pageCount: postsQuery.data?.pagination?.pageCount ?? -1,
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
        <h2 className='mb-4 text-3xl font-bold'>Posts</h2>

        <div>
          <CustomLink href='/post/create' className={cn(buttonVariants())}>
            <PlusIcon className='size-4' /> <span>New Post</span>
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
