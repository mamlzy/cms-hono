import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { folderRequest } from '@/requests/folder.request';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Folder } from '@repo/db/schema';
import {
  createFolderSchema,
  type CreateFolderSchema,
} from '@repo/shared/schemas';
import type { OmitStrict } from '@repo/shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCurrentOrganizationId } from '@/lib/navigation';
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

export function CreateFolderDialog({
  show,
  setShow,
  onCreateSuccess,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  onCreateSuccess?: (
    createdFolder: OmitStrict<Folder, 'createdAt' | 'updatedAt' | 'deletedAt'>
  ) => void;
}) {
  const methods = useForm<CreateFolderSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      organizationId: '',
      parentId: null,
    },
    resolver: zodResolver(createFolderSchema),
  });
  const { control, handleSubmit, resetField, setValue } = methods;

  const qc = useQueryClient();
  const currentOrganizationId = useCurrentOrganizationId();

  //! watch currentOrganizationId
  useEffect(() => {
    setValue('organizationId', currentOrganizationId);
  }, [currentOrganizationId]);

  const createFolderMutation = useMutation({
    mutationFn: folderRequest.create,
  });

  const onSubmit = async (values: CreateFolderSchema) => {
    createFolderMutation.mutate(
      {
        organizationId: currentOrganizationId,
        name: values.name,
        parentId: null,
      },
      {
        onSuccess: (createdFolder) => {
          qc.invalidateQueries({ queryKey: ['folders'] });
          resetField('name');
          onCreateSuccess?.(createdFolder);
          setShow(false);
          toast.success('Folder created.');
        },
        onError: (err: any) => {
          console.log('err =>', err);
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription className='sr-only'>
            create folder form
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 py-4'
          >
            <InputText control={control} name='name' mandatory />

            <DialogFooter>
              <Button type='submit' disabled={createFolderMutation.isPending}>
                {createFolderMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
