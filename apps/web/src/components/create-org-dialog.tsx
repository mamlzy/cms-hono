import { useState, type Dispatch, type SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@repo/auth/client';
import {
  createOrganizationSchema,
  type CreateOrganizationSchema,
} from '@repo/shared/schemas';
import { FormProvider, useForm } from 'react-hook-form';
import slugify from 'slugify';
import { toast } from 'sonner';

import { InputText } from '@/components/inputs/rhf/input-text';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CreateOrganizationDialog({
  show,
  setShow,
  onCreateSuccess,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  onCreateSuccess?: () => void;
}) {
  const methods = useForm<CreateOrganizationSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      logo: 'https://placehold.co/320x320',
      metadata: {
        primaryHexColor: '03aa4b',
      },
    },
    resolver: zodResolver(createOrganizationSchema),
  });
  const { control, handleSubmit, reset } = methods;

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (values: CreateOrganizationSchema) => {
    setIsPending(true);

    await authClient.organization.create(
      {
        name: values.name,
        slug: slugify(values.name, { lower: true }),
        logo: values.logo,
        metadata: values.metadata,
      },
      {
        onSuccess: () => {
          reset();
          onCreateSuccess?.();
          setShow(false);
          toast.success('Organization created.');
        },
        onError: (err) => {
          console.log('err =>', err);
          toast.error(err.error.message);
        },
      }
    );

    setIsPending(false);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription className='sr-only'>
            create organization form
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 py-4'
          >
            <InputText control={control} name='name' mandatory />

            <DialogFooter>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
