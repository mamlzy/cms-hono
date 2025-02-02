'use client';

import { Fragment, useCallback, useState } from 'react';
import Image from 'next/image';
import { mediaRequest } from '@/requests/media.request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EllipsisIcon, Loader2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { MediaDialog } from '@/components/media-dialog';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Page() {
  const qc = useQueryClient();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  const mediasQuery = useQuery({
    queryKey: ['medias'],
    queryFn: mediaRequest.getAll,
  });

  const uploadMediaMutation = useMutation({
    mutationFn: mediaRequest.upload,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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

    setShowUploadDialog(false);

    toast.promise(uploadMediaMutation.mutateAsync(formData), {
      loading: 'Uploading...',
      success: () => {
        qc.invalidateQueries({ queryKey: ['medias'] });

        return 'Image uploaded.';
      },
      error: (err) => {
        console.log('err =>', err);
        return `Error, ${err.message}`;
      },
      position: 'top-center',
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const deleteMediaMutation = useMutation({
    mutationFn: mediaRequest.deleteById,
  });

  const handleDelete = async (mediaId: string) => {
    toast.promise(deleteMediaMutation.mutateAsync(mediaId), {
      loading: 'Deleting...',
      success: () => {
        qc.invalidateQueries({ queryKey: ['medias'] });

        return `Media deleted.`;
      },
      error: (err) => {
        console.log('err =>', err);
        return `Error, ${err.message}`;
      },
    });
  };

  return (
    <>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='mb-4 text-3xl font-bold'>Media</h2>

        <div>
          <Button onClick={() => setShowUploadDialog(true)}>
            <PlusIcon className='size-4' /> <span>Add Media</span>
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {mediasQuery.isPending && (
          <div>
            <Loader2Icon className='size-8 animate-spin' />
          </div>
        )}

        {mediasQuery.isSuccess &&
          mediasQuery.data.map((media) => (
            <Fragment key={media.id}>
              <div className=''>
                <div className='relative'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media${media.url}`}
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
            </Fragment>
          ))}
      </div>

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
      />
    </>
  );
}
