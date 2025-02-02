import { type Dispatch, type SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createOrganizationSchema,
  type CreateOrganizationSchema,
} from '@repo/shared/schemas';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateOrganizationMutation } from '@/hooks/react-query/organization.query';
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
      metadata: JSON.stringify({
        primaryHexColor: '03aa4b',
      }),
    },
    resolver: zodResolver(createOrganizationSchema),
  });
  const { control, handleSubmit, reset } = methods;

  const createOrganizationMutation = useCreateOrganizationMutation();

  const onSubmit = async (values: CreateOrganizationSchema) => {
    createOrganizationMutation.mutate(values, {
      onSuccess: () => {
        reset();
        onCreateSuccess?.();
        setShow(false);

        toast.success('Organization created.');
      },
      onError: (err) => {
        console.log('err =>', err);
        toast.error(err.message);
      },
    });
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
              <Button
                type='submit'
                disabled={createOrganizationMutation.isPending}
              >
                {createOrganizationMutation.isPending
                  ? 'Submitting...'
                  : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
