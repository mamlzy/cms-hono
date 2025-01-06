'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown, GalleryVerticalEndIcon, Plus } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { authClient, Organization } from '@/lib/auth-client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/sidebar/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputText } from '../inputs/rhf/input-text';

// type Organization = {
//   id: string;
//   createdAt: Date;
//   name: string;
//   slug: string;
//   metadata?: any;
//   logo?: string | null | undefined;
// };

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [activeOrg, setActiveTeam] = useState<Organization | null>(null);
  const [showAddOrgDialog, setshowAddOrgDialog] = useState(false);

  const { data: organizations } = authClient.useListOrganizations();
  const session = authClient.useSession();

  console.log('session =>', session);

  useEffect(() => {
    if (Array.isArray(organizations) && organizations.length > 0) {
      setActiveTeam(organizations[0]);
    }
  }, [organizations]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <GalleryVerticalEndIcon className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {activeOrg?.name}
                  </span>
                  <span className='truncate text-xs'>{activeOrg?.slug}</span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-xs text-muted-foreground'>
                Organizations
              </DropdownMenuLabel>
              {organizations?.map((org: Organization) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => setActiveTeam(org)}
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <GalleryVerticalEndIcon className='size-4 shrink-0' />
                  </div>
                  {org.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2'
                onClick={() => setshowAddOrgDialog(true)}
              >
                <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                  <Plus className='size-4' />
                </div>
                <div className='font-medium text-muted-foreground'>
                  Add organization
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AddOrgDialog
        showAddOrgDialog={showAddOrgDialog}
        setshowAddOrgDialog={setshowAddOrgDialog}
      />
    </>
  );
}

const addOrgSchema = z.object({
  name: z.string().trim().nonempty(),
  slug: z.string().trim().nonempty(),
});

type AddOrgSchema = z.infer<typeof addOrgSchema>;

function AddOrgDialog({
  showAddOrgDialog,
  setshowAddOrgDialog,
}: {
  showAddOrgDialog: boolean;
  setshowAddOrgDialog: Dispatch<SetStateAction<boolean>>;
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
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Organization created');
      setshowAddOrgDialog(false);
      reset();
    } catch (err: any) {
      console.log('err =>', err);

      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={showAddOrgDialog} onOpenChange={setshowAddOrgDialog}>
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
