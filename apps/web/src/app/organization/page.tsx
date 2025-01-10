'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { organizationService } from '@/services/organization.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { CreateOrgDialog } from '@/components/create-org-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const router = useRouter();

  //! better-auth
  // const { data: organizations, isPending } = authClient.useListOrganizations();

  const qc = useQueryClient();

  const [showCreateOrgDialog, setShowCreateOrgDialog] = useState(false);

  //! react-query
  const { data: organizations, isPending } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
  });

  const handleSelectOrg = async (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    orgSlug: string
  ) => {
    const { error } = await authClient.organization.setActive({
      organizationSlug: orgSlug,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push(`${orgSlug}/dashboard`);
  };

  const onCreateOrgSuccess = () => {
    qc.invalidateQueries({ queryKey: ['organizations'] });
  };

  return (
    <>
      <div className='flex min-h-svh justify-center'>
        <div className='w-full max-w-[1100px] py-8'>
          <div className='mb-8 flex items-center justify-between'>
            <p className='text-2xl font-bold'>Organization</p>
            <Button onClick={() => setShowCreateOrgDialog(true)}>
              <PlusIcon /> Create Organization
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            {isPending ? (
              <CardSkeleton />
            ) : (
              organizations?.map((org, idx) => {
                const metadata: { primaryHexColor: string | null } =
                  org.metadata ? JSON.parse(org.metadata) : null;

                console.log('metadata =>', metadata);

                return (
                  <div
                    key={idx}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectOrg(e, org.slug!);
                      }
                    }}
                    onClick={(e) => handleSelectOrg(e, org.slug!)}
                    className='relative z-0 overflow-hidden rounded-xl border bg-background p-6 dark:bg-muted'
                  >
                    <div
                      className='absolute -right-32 -top-32 z-[-1] size-64 rounded-full bg-muted dark:bg-background'
                      style={{
                        backgroundColor: metadata.primaryHexColor
                          ? `#${metadata.primaryHexColor}`
                          : undefined,
                      }}
                    />
                    <Image
                      src='/logo-inspiry.webp'
                      alt='Logo Inspiry'
                      sizes='100vw'
                      className='mx-auto mb-6 size-40 object-cover'
                      width={0}
                      height={0}
                      quality={100}
                    />
                    <div className='text-center'>
                      <p className='mb-6 text-xl font-semibold'>{org.name}</p>
                      <p className='text-lg text-muted-foreground'>
                        No Description
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <CreateOrgDialog
        show={showCreateOrgDialog}
        setShow={setShowCreateOrgDialog}
        onCreateSuccess={onCreateOrgSuccess}
      />
    </>
  );
}

function CardSkeleton() {
  return Array.from({ length: 3 }).map((_, idx) => (
    <Skeleton key={idx} className='h-[350px] w-full' />
  ));
}
