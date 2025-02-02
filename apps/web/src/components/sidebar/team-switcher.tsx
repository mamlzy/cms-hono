'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { Organization } from '@repo/db/schema';
import { ChevronsUpDown, GalleryVerticalEndIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import {
  useListOrganizations,
  useSetActiveOrganizationMutation,
} from '@/hooks/react-query/organization.query';
import { pathnameWithoutOrg } from '@/lib/pathname-without-org';
import { CreateOrganizationDialog } from '@/components/create-org-dialog';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/sidebar/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function OrganizationSwitcher() {
  const router = useRouter();
  const params = useParams<{ organizationId: string }>();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [showCreateOrganizationDialog, setShowCreateOrganizationDialog] =
    useState(false);

  const { data: organizations } = useListOrganizations();
  const setActiveOrganizationMutation = useSetActiveOrganizationMutation();

  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);

  const handleSelectOrg = async (organization: Organization) => {
    setActiveOrganizationMutation.mutate(
      { organizationId: organization.id! },
      {
        onSuccess: () => {
          router.push(`/${organization.id}/${pathnameWithoutOrg(pathname)}`);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  useEffect(() => {
    if (Array.isArray(organizations) && organizations.length > 0) {
      const activeOrg = organizations.find(
        (org) => org.id === params.organizationId
      )!;

      setActiveOrg(activeOrg);
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
              {organizations?.map((org) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => handleSelectOrg(org)}
                  disabled={setActiveOrganizationMutation.isPending}
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
                onClick={() => setShowCreateOrganizationDialog(true)}
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

      <CreateOrganizationDialog
        show={showCreateOrganizationDialog}
        setShow={setShowCreateOrganizationDialog}
      />
    </>
  );
}
