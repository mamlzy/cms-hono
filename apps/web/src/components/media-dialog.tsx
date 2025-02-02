import { Fragment } from 'react';
import Image from 'next/image';
import { mediaRequest } from '@/requests/media.request';
import type { Media } from '@repo/db/schema';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, UploadCloudIcon } from 'lucide-react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type MediaTab = 'library' | 'upload';

export function MediaDialog({
  open,
  onOpenChange,
  getRootProps,
  getInputProps,
  onSelectImage,
  defaultTabValue,
  tabValue,
  onTabValueChange,
  uploadDisabled,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onSelectImage: (media: Media) => void;
  defaultTabValue?: MediaTab;
  tabValue?: MediaTab;
  onTabValueChange?: React.Dispatch<React.SetStateAction<MediaTab>>;
  uploadDisabled?: boolean;
}) {
  const mediasQuery = useQuery({
    queryKey: ['medias'],
    queryFn: mediaRequest.getAll,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='block h-[calc(100svh-100px)] w-[calc(100svw-100px)] max-w-none'>
        <Tabs
          defaultValue={defaultTabValue}
          value={tabValue}
          onValueChange={
            onTabValueChange
              ? (value) => onTabValueChange(value as MediaTab)
              : undefined
          }
          className='h-full'
        >
          <div className='mb-6 flex items-center justify-between'>
            <DialogHeader className=''>
              <DialogTitle className='text-2xl'>Upload Media</DialogTitle>
              <DialogDescription className='sr-only'>
                Upload Media
              </DialogDescription>
            </DialogHeader>

            <TabsList className='h-12'>
              <TabsTrigger
                value='library'
                className='px-4 py-2 text-base font-semibold'
              >
                Library
              </TabsTrigger>
              <TabsTrigger
                value='upload'
                className='px-4 py-2 text-base font-semibold'
              >
                Upload
              </TabsTrigger>
            </TabsList>

            {/* Dont remove this empty div! */}
            <div className='' />
          </div>
          <TabsContent value='library' className='h-[calc(100%-76px)] w-full'>
            <div className='3xl:grid-cols-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 2xl:grid-cols-5'>
              {mediasQuery.isPending && (
                <div>
                  <Loader2Icon className='size-8 animate-spin' />
                </div>
              )}

              {mediasQuery.isSuccess &&
                mediasQuery.data.map((media) => (
                  <Fragment key={media.id}>
                    <div
                      className=''
                      role='button'
                      tabIndex={0}
                      onClick={() => onSelectImage(media)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onSelectImage(media);
                        }
                      }}
                    >
                      <div className='relative'>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/media${media.url}`}
                          alt={media.originalName}
                          sizes='100vw'
                          className='h-36 w-full rounded-2xl object-cover xl:h-52'
                          width={0}
                          height={0}
                          quality={100}
                        />
                      </div>
                      <p className='truncate text-sm'>{media.originalName}</p>
                      <p className='text-sm text-muted-foreground'>
                        {media.size}
                      </p>
                    </div>
                  </Fragment>
                ))}
            </div>
          </TabsContent>
          <TabsContent value='upload' className='h-[calc(100%-76px)] w-full'>
            <div className='size-full'>
              <label
                {...getRootProps()}
                className={cn(
                  'relative flex size-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:bg-neutral-900/80',
                  uploadDisabled && 'pointer-events-none opacity-50'
                )}
              >
                <div className='text-center'>
                  <div className='mx-auto max-w-min rounded-md border p-2'>
                    <UploadCloudIcon size={20} />
                  </div>

                  <p className='mt-2 text-sm text-muted-foreground'>
                    <span className='font-semibold'>Drag file</span>
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Click to upload file (files should be under 2 MB)
                  </p>
                </div>
              </label>

              <Input
                {...getInputProps()}
                id='dropzone-file'
                accept='image/png, image/jpeg'
                type='file'
                className='hidden'
                multiple={false}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
