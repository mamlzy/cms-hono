'use client';

import { useEffect } from 'react';
import { categoryRequest } from '@/requests/category.request';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCategorySchema,
  type CreateCategorySchema,
} from '@repo/shared/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function Page() {
  const methods = useForm<CreateCategorySchema>({
    mode: 'all',
    defaultValues: {
      title: '',
      organizationId: '',
    },
    resolver: zodResolver(createCategorySchema),
  });
  const { control, handleSubmit, resetField, setValue } = methods;

  const qc = useQueryClient();
  const currentOrganizationId = useCurrentOrganizationId();

  //! watch currentOrganizationId
  useEffect(() => {
    if (currentOrganizationId) {
      setValue('organizationId', currentOrganizationId);
    } else {
      setValue('organizationId', '');
    }
  }, [currentOrganizationId]);

  const createCategoryMutation = useMutation({
    mutationFn: categoryRequest.create,
  });

  const onSubmit = (values: CreateCategorySchema) => {
    createCategoryMutation.mutate(values, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['categories'] });
        toast.success(`Category created.`);
        resetField('title');
      },
      onError: (err) => {
        console.log('err =>', err);
        toast.error(err.message);
      },
    });
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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
            disabled={createCategoryMutation.isPending}
            className='text-base'
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
