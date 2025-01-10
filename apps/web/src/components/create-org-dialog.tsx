import { Dispatch, SetStateAction, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { authClient } from '@/lib/auth-client';
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

const addOrgSchema = z.object({
  name: z.string().trim().nonempty(),
  slug: z.string().trim().nonempty(),
});

type AddOrgSchema = z.infer<typeof addOrgSchema>;

export function CreateOrgDialog({
  show,
  setShow,
  onCreateSuccess,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  onCreateSuccess?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const methods = useForm<AddOrgSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      slug: '',
    },
    resolver: zodResolver(addOrgSchema),
  });
  const { control, handleSubmit, reset } = methods;

  const onSubmit = async (values: AddOrgSchema) => {
    setIsPending(true);

    try {
      const { error } = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
        logo: 'https://example.com/logo.png',
        metadata: {
          primaryHexColor: '03aa4b',
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      onCreateSuccess?.();

      toast.success('Organization created');
      setShow(false);
      reset();
    } catch (err: any) {
      console.log('err =>', err);

      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Organization</DialogTitle>
          <DialogDescription className='sr-only'>
            add organization form
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-4 py-4'
          >
            <InputText control={control} name='name' mandatory />

            <InputText control={control} name='slug' mandatory />

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
