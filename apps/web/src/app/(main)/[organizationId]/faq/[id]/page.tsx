'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { faqRequest } from '@/requests/faq.request';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFaqSchema, type CreateFaqSchema } from '@repo/shared/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
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

export default function PageClient() {
  const methods = useForm<CreateFaqSchema>({
    mode: 'all',
    defaultValues: {
      title: '',
      organizationId: '',
      description: '',
    },
    resolver: zodResolver(createFaqSchema),
  });
  const { control, handleSubmit, setValue } = methods;

  const params = useParams<{ id: string }>();
  const qc = useQueryClient();
  const currentOrganizationId = useCurrentOrganizationId();

  //! get faq by id
  const faqQuery = useQuery({
    queryKey: ['faqs', params.id],
    queryFn: () => faqRequest.getById(params.id),
  });

  //! faqQuery success
  useEffect(() => {
    if (faqQuery.isSuccess) {
      const { title, description } = faqQuery.data;

      setValue('title', title);
      setValue('description', description);
    }
  }, [faqQuery.isSuccess]);

  //! watch currentOrganizationId
  useEffect(() => {
    if (currentOrganizationId) {
      setValue('organizationId', currentOrganizationId);
    } else {
      setValue('organizationId', '');
    }
  }, [currentOrganizationId]);

  const updateFaqMutation = useMutation({
    mutationFn: faqRequest.updateById,
  });

  const onSubmit = (values: CreateFaqSchema) => {
    updateFaqMutation.mutate(
      { faqId: params.id, payload: values },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['faqs'] });
          toast.success(`Faq updated.`);
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
      <div>
        <Breadcrumb>
          <BreadcrumbList className='sm:gap-2'>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <CustomLink href='/faq'>Faqs</CustomLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {faqQuery.isPending && (
        <div>
          <Loader2Icon className='size-8 animate-spin' />
        </div>
      )}

      {faqQuery.isSuccess && (
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
              disabled={updateFaqMutation.isPending}
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
