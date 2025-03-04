'use client';

import { useEffect } from 'react';
import { faqRequest } from '@/requests/faq.request';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFaqSchema, type CreateFaqSchema } from '@repo/shared/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CustomLink, useCurrentOrganizationId } from '@/lib/navigation';
import { InputText } from '@/components/inputs/rhf/input-text';
import InputTextArea from '@/components/inputs/rhf/input-text-area';
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
  const methods = useForm<CreateFaqSchema>({
    mode: 'all',
    defaultValues: {
      organizationId: '',
      title: '',
      description: '',
    },
    resolver: zodResolver(createFaqSchema),
  });
  const { control, handleSubmit, reset, setValue } = methods;

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

  const createFaqMutation = useMutation({
    mutationFn: faqRequest.create,
  });

  const onSubmit = (values: CreateFaqSchema) => {
    createFaqMutation.mutate(values, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['faqs'] });
        toast.success(`Faq created.`);
        reset();
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
              <CustomLink href='/faq'>Faqs</CustomLink>
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

          <InputTextArea control={control} name='description' mandatory />

          <Button
            type='submit'
            size='lg'
            disabled={createFaqMutation.isPending}
            className='text-base'
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
