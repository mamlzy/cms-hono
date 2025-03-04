'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { categoryRequest } from '@/requests/category.request';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCategorySchema,
  type CreateCategorySchema,
} from '@repo/shared/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomLink, useCurrentOrganizationId } from '@/lib/navigation';
import { InputText } from '@/components/inputs/rhf/input-text';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export default function PageClient() {
  const methods = useForm<CreateCategorySchema>({
    mode: 'all',
    defaultValues: {
      title: '',
      organizationId: '',
    },
    resolver: zodResolver(createCategorySchema),
  });
  const { control, handleSubmit, setValue } = methods;

  const params = useParams<{ id: string }>();
  const qc = useQueryClient();
  const currentOrganizationId = useCurrentOrganizationId();

  //! get category by id
  const categoryQuery = useQuery({
    queryKey: ['categories', params.id],
    queryFn: () => categoryRequest.getById(params.id),
  });

  //! categoryQuery success
  useEffect(() => {
    if (categoryQuery.isSuccess) {
      setValue('title', categoryQuery.data.title);
    }
  }, [categoryQuery.isSuccess]);

  //! watch currentOrganizationId
  useEffect(() => {
    if (currentOrganizationId) {
      setValue('organizationId', currentOrganizationId);
    } else {
      setValue('organizationId', '');
    }
  }, [currentOrganizationId]);

  const updateCategoryMutation = useMutation({
    mutationFn: categoryRequest.updateById,
  });

  const onSubmit = (values: CreateCategorySchema) => {
    updateCategoryMutation.mutate(
      { categoryId: params.id, payload: values },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['categories'] });
          toast.success(`Category updated.`);
        },
        onError: (err) => {
          console.log('err =>', err);
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <>
      <Breadcrumb className='mb-4'>
        <BreadcrumbList className='sm:gap-2'>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink href='/category'>Categories</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {categoryQuery.isPending && (
        <div>
          <Loader2Icon className='size-8 animate-spin' />
        </div>
      )}

      {categoryQuery.isSuccess && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4'
          >
            <InputText
              control={control}
              name='title'
              mandatory
              inputClassName='h-11 !text-xl'
            />

            <Button
              type='submit'
              size='lg'
              disabled={updateCategoryMutation.isPending}
              className='text-base'
            >
              Submit
            </Button>
          </form>
        </FormProvider>
      )}
    </>
  );
}
