'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  useListOrganizations,
  useSetActiveOrganizationMutation,
} from '@/hooks/react-query/organization.query';
import { CreateOrganizationDialog } from '@/components/create-org-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const router = useRouter();

  const { data: organizations, isPending } = useListOrganizations();

  const [showCreateOrganizationDialog, setShowCreateOrganizationDialog] =
    useState(false);

  const setActiveOrganizationMutation = useSetActiveOrganizationMutation();

  const handleSelectOrg = async (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    organizationId: string
  ) => {
    setActiveOrganizationMutation.mutate(
      { organizationId },
      {
        onSuccess: () => {
          router.push(`${organizationId}/dashboard`);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <>
      <div className='flex min-h-svh justify-center'>
        <div className='w-full max-w-[1100px] py-8'>
          <div className='mb-8 flex items-center justify-between'>
            <p className='text-2xl font-bold'>Organization</p>
            <Button onClick={() => setShowCreateOrganizationDialog(true)}>
              <PlusIcon /> Create Organization
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            {isPending ? (
              <CardSkeleton />
            ) : (
              organizations?.map((organization, idx) => {
                const metadata: { primaryHexColor: string | null } =
                  organization.metadata
                    ? JSON.parse(organization.metadata)
                    : null;

                return (
                  <div
                    key={idx}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectOrg(e, organization.id);
                      }
                    }}
                    onClick={(e) => handleSelectOrg(e, organization.id)}
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
                      src={organization?.logo!}
                      alt='Logo Inspiry'
                      sizes='100vw'
                      className='mx-auto mb-6 size-40 rounded-full object-cover'
                      width={0}
                      height={0}
                      quality={100}
                      unoptimized
                    />
                    <div className='text-center'>
                      <p className='mb-6 text-xl font-semibold'>
                        {organization.name}
                      </p>
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

      <CreateOrganizationDialog
        show={showCreateOrganizationDialog}
        setShow={setShowCreateOrganizationDialog}
      />
    </>
  );
}

function CardSkeleton() {
  return Array.from({ length: 3 }).map((_, idx) => (
    <Skeleton key={idx} className='h-[350px] w-full' />
  ));
}
