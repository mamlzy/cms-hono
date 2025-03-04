'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { folderRequest } from '@/requests/folder.request';
import { mediaRequest } from '@/requests/media.request';
import type { QsFolderSchema, QsMediaSchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  EllipsisIcon,
  EllipsisVerticalIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import { CustomLink, useCurrentOrganizationId } from '@/lib/navigation';
import { getNextPageParamFn } from '@/lib/react-query';
import { MediaDialog } from '@/components/media-dialog/media-dialog';
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Page() {
  const qc = useQueryClient();
  const params = useParams<{ folderId: string }>();
  const currentOrganizationId = useCurrentOrganizationId();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const folderQs: ToQueryString<QsFolderSchema> = {
    id: params.folderId,
  };

  const folderQuery = useQuery({
    enabled: params.folderId !== 'root',
    queryKey: ['folders', params.folderId],
    queryFn: () => folderRequest.getById(params.folderId!),
  });

  const foldersInifiniteQuery = useInfiniteQuery({
    queryKey: ['folders', folderQs],
    queryFn: ({ pageParam }) =>
      folderRequest.getAll({
        ...folderQs,
        page: String(pageParam),
      }),
    getNextPageParam: getNextPageParamFn,
    initialPageParam: 1,
  });
  const folders = useMemo(
    () => foldersInifiniteQuery.data?.pages.flatMap((page) => page.data) || [],
    [foldersInifiniteQuery.data]
  );

  //! Infinite scroll logic
  const { ref: foldersInfiniteRef, inView } = useInView();
  useEffect(() => {
    if (inView && foldersInifiniteQuery.hasNextPage) {
      foldersInifiniteQuery.fetchNextPage();
    }
  }, [inView, foldersInifiniteQuery.hasNextPage]);

  const mediaQS: QsMediaSchema = {
    folderId: params.folderId,
  };

  const mediasQuery = useQuery({
    queryKey: ['medias', mediaQS],
    queryFn: () => mediaRequest.getAll(mediaQS),
  });

  const uploadMediaMutation = useMutation({
    mutationFn: mediaRequest.upload,
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        toast.error('Only one file is allowed.');
        return;
      }

      const file = acceptedFiles[0];

      console.log('file =>', file);

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.');
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        toast.error('File size should be less than 2MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('organizationId', currentOrganizationId);
      if (selectedFolderId) {
        formData.append('folderId', selectedFolderId);
      }

      console.log('values =>', Object.fromEntries(formData.entries()));

      setShowUploadDialog(false);

      toast.promise(uploadMediaMutation.mutateAsync(formData), {
        loading: 'Uploading...',
        success: () => {
          qc.invalidateQueries({ queryKey: ['medias'] });
          setSelectedFolderId(null);

          return 'Image uploaded.';
        },
        error: (err) => {
          console.log('err =>', err);
          return `Error, ${err.message}`;
        },
        position: 'top-center',
      });
    },
    [selectedFolderId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const deleteMediaMutation = useMutation({
    mutationFn: mediaRequest.deleteById,
  });

  const handleDelete = async (mediaId: string) => {
    toast.promise(
      deleteMediaMutation.mutateAsync({
        mediaId,
        organizationId: currentOrganizationId,
        folderId: params.folderId,
      }),
      {
        loading: 'Deleting...',
        success: () => {
          qc.invalidateQueries({ queryKey: ['medias'] });

          return `Media deleted.`;
        },
        error: (err) => {
          console.log('err =>', err);
          return `Error, ${err.message}`;
        },
      }
    );
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between gap-4'>
        <h2 className='text-3xl font-bold'>Media</h2>

        <div>
          <Button onClick={() => setShowUploadDialog(true)}>
            <PlusIcon className='size-4' /> <span>Add Media</span>
          </Button>
        </div>
      </div>

      {folderQuery.isSuccess && (
        <Breadcrumb className='mb-8'>
          <BreadcrumbList className='sm:gap-2'>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <CustomLink href='/media'>Media</CustomLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{folderQuery.data.data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {(mediasQuery.isPending || foldersInifiniteQuery.isPending) && (
        <div>
          <Loader2Icon className='size-8 animate-spin' />
        </div>
      )}

      {/* Folder */}
      {foldersInifiniteQuery.isSuccess && folders.length > 0 && (
        <div className='mb-8 mt-4 grid grid-cols-4 gap-4'>
          {folders.map((folder) => (
            <CustomLink
              href={`/media/folder/${folder.id}`}
              key={folder.id}
              className='flex w-full items-center rounded-md bg-accent py-2 pl-3 pr-2 transition-colors hover:bg-accent-hover'
            >
              <span className='inline-flex flex-1 items-center font-medium'>
                📁 {folder.name}
              </span>
              <Button
                variant='ghost'
                data-prevent-progress
                onClick={(e) => {
                  e.preventDefault();
                }}
                className='size-6 p-0 hover:bg-background'
              >
                <EllipsisVerticalIcon />
              </Button>
            </CustomLink>
          ))}

          {/* Flder Infinite Scroll Trigger */}
          <div
            ref={foldersInfiniteRef}
            className='w-full text-center text-muted-foreground'
          >
            {foldersInifiniteQuery.isFetchingNextPage && (
              //! Loader
              <Loader2Icon className='animate-spin' />
            )}
          </div>
        </div>
      )}

      {/* Media */}
      {mediasQuery.isSuccess && (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {mediasQuery.data.length > 0 ? (
            mediasQuery.data.map((media) => {
              const mediaSrc = `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${currentOrganizationId}${
                params.folderId !== 'root' ? `/${params.folderId}` : ''
              }${media.url}`;

              return (
                <div key={media.id}>
                  <div className='relative'>
                    <Image
                      src={mediaSrc}
                      alt={media.originalName}
                      sizes='100vw'
                      className='aspect-video w-full rounded-2xl object-cover'
                      width={0}
                      height={0}
                      quality={100}
                    />

                    {media.posts.length > 0 && (
                      <Badge className='absolute left-1 top-1 rounded-3xl px-1.5 py-px text-xs uppercase hover:bg-primary'>
                        used
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='absolute right-1 top-1 size-7 bg-accent/50 p-0 hover:bg-accent/60'
                        >
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='center'
                        sideOffset={0}
                        className='font-normal'
                      >
                        <DropdownMenuItem
                          onClick={() => setSelectedMediaId(media.id)}
                        >
                          <Trash2Icon className='mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className='truncate text-sm'>{media.originalName}</p>
                  <p className='text-sm text-muted-foreground'>{media.size}</p>
                </div>
              );
            })
          ) : (
            <p className='text-muted-foreground'>No media.</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!selectedMediaId}
        onOpenChange={(bool) => {
          if (!bool) {
            setSelectedMediaId(null);
          }
        }}
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
            <AlertDialogAction onClick={() => handleDelete(selectedMediaId!)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Media Dialog */}
      <MediaDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        defaultTabValue='upload'
        onSelectImage={() => {}}
        uploadDisabled={uploadMediaMutation.isPending}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
      />
    </>
  );
}
