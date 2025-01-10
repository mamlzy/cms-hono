'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ChevronsUpDown, GalleryVerticalEndIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { authClient, Organization } from '@/lib/auth-client';
import { pathnameWithoutOrg } from '@/lib/pathname-without-org';
import { CreateOrgDialog } from '@/components/create-org-dialog';
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

export function TeamSwitcher() {
  const router = useRouter();
  const params = useParams<{ orgSlug: string }>();
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [showCreateOrgDialog, setShowCreateOrgDialog] = useState(false);

  const { data: organizations } = authClient.useListOrganizations();

  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [activeOrgIsPending, setActiveOrgIsPending] = useState(false);

  const handleSelectOrg = async (org: Organization) => {
    setActiveOrgIsPending(true);

    const { error } = await authClient.organization.setActive({
      organizationSlug: org.slug,
    });

    if (error) {
      setActiveOrgIsPending(false);

      toast.error(error.message);
      return;
    }

    setActiveOrgIsPending(false);
    router.push(`/${org.slug}/${pathnameWithoutOrg(pathname)}`);
  };

  useEffect(() => {
    if (Array.isArray(organizations) && organizations.length > 0) {
      const activeOrg = organizations.find(
        (org) => org.slug === params.orgSlug
      );

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
              {organizations?.map((org: Organization) => (
                <DropdownMenuItem
                  key={org.name}
                  onClick={() => handleSelectOrg(org)}
                  disabled={activeOrgIsPending}
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
                onClick={() => setShowCreateOrgDialog(true)}
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

      <CreateOrgDialog
        show={showCreateOrgDialog}
        setShow={setShowCreateOrgDialog}
      />
    </>
  );
}
