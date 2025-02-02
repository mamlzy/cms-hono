'use client';

import { useCallback, useEffect, useState } from 'react';
import { mediaRequest } from '@/requests/media.request';
import { postRequest } from '@/requests/post.request';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Media } from '@repo/db/schema';
import { createPostSchema, type CreatePostSchema } from '@repo/shared/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomLink, useCurrentOrganizationId } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { InputText } from '@/components/inputs/rhf/input-text';
import { MediaDialog, type MediaTab } from '@/components/media-dialog';
import { InputTiptap } from '@/components/tiptap';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { InputCategory } from '../_components/input-category';

export default function Page() {
  const methods = useForm<CreatePostSchema>({
    mode: 'all',
    defaultValues: {
      title: '',
      content: '',
      status: 'PUBLISHED',
      thumbnailMediaId: '',
      categories: [],
    },
    resolver: zodResolver(createPostSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const qc = useQueryClient();
  const currentOrganizationId = useCurrentOrganizationId();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [tabValue, setTabValue] = useState<MediaTab>('library');
  const [selectedThumbnail, setSelectedThumbnail] = useState<Media | null>(
    null
  );

  //! watch currentOrganizationId
  useEffect(() => {
    if (currentOrganizationId) {
      setValue('organizationId', currentOrganizationId);
    } else {
      setValue('organizationId', '');
    }
  }, [currentOrganizationId]);

  //! watch selectedThumbnail
  useEffect(() => {
    if (selectedThumbnail) {
      setValue('thumbnailMediaId', selectedThumbnail.id);
    } else {
      setValue('thumbnailMediaId', '');
    }
  }, [selectedThumbnail?.id]);

  //! upload media
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

    toast.promise(uploadMediaMutation.mutateAsync(formData), {
      loading: 'Uploading...',
      success: () => {
        qc.invalidateQueries({ queryKey: ['medias'] });
        setTabValue('library');

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

  const handleSelectImage = async (media: Media) => {
    setSelectedThumbnail(media);
    setShowUploadDialog(false);
  };

  //! create post
  const createPostMutation = useMutation({
    mutationFn: postRequest.create,
  });

  const onSubmit = (values: CreatePostSchema) => {
    console.log('values =>', values);

    createPostMutation.mutate(values, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['posts'] });
        qc.invalidateQueries({ queryKey: ['medias'] });
        reset({
          organizationId: values.organizationId,
        });
        setSelectedThumbnail(null);

        toast.success(`Post created.`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList className='sm:gap-2'>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <CustomLink href='/post'>Posts</CustomLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='flex items-start gap-x-8'>
        <FormProvider {...methods}>
          <div className='grid flex-1 grid-cols-1 gap-4'>
            <InputText
              control={control}
              name='title'
              mandatory
              inputClassName='h-11 !text-xl'
            />

            <InputTiptap control={control} name='content' mandatory />

            <InputCategory control={control} name='categories' />
          </div>

          <div className=''>
            <div className='flex min-w-72 flex-col rounded-xl border p-4'>
              <div className='mb-6 flex flex-col space-y-2'>
                <Button
                  type='button'
                  onClick={() => {
                    setValue('status', 'PUBLISHED');
                    handleSubmit(onSubmit)();
                  }}
                  disabled={createPostMutation.isPending}
                >
                  Publish
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => {
                    setValue('status', 'DRAFT');
                    handleSubmit(onSubmit)();
                  }}
                  disabled={createPostMutation.isPending}
                  className='bg-slate-200 hover:bg-slate-200/80 dark:bg-slate-400 dark:text-black dark:hover:bg-slate-400/80'
                >
                  Save Draft
                </Button>
              </div>

              <div className=''>
                <p className='text-xl font-semibold'>Thumbnail</p>
                <button
                  type='button'
                  onClick={() => setShowUploadDialog(true)}
                  disabled={createPostMutation.isPending}
                  className='flex aspect-video w-full items-center justify-center rounded-xl border bg-slate-200 hover:bg-slate-200/80 dark:bg-slate-400 dark:text-black dark:hover:bg-slate-400/80'
                  style={{
                    background: selectedThumbnail
                      ? `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/media${selectedThumbnail.url}) center / cover no-repeat`
                      : undefined,
                  }}
                >
                  <ImageIcon
                    className={cn('size-6', selectedThumbnail && 'hidden')}
                  />
                </button>
                {errors.thumbnailMediaId && (
                  <p className='text-xs text-red-600'>
                    {errors.thumbnailMediaId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </FormProvider>
      </div>

      {/* Upload Media Dialog */}
      <MediaDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        onSelectImage={handleSelectImage}
        tabValue={tabValue}
        onTabValueChange={setTabValue}
        uploadDisabled={uploadMediaMutation.isPending}
      />
    </>
  );
}
