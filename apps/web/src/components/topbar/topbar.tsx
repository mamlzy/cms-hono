'use client';

import { ImagesIcon } from 'lucide-react';

import { CustomLink, useCustomPathname } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '../sidebar/ui/sidebar';

export function Topbar() {
  const pathname = useCustomPathname();

  // Match /media or /media/folder/[folderId] but not deeper paths
  const isActive =
    pathname === '/media' || /^\/media\/folder\/[^/]+$/.test(pathname);

  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />

        <ul>
          <li className=''>
            <CustomLink
              href='/media'
              className={cn(
                'flex items-center text-sm hover:underline',
                isActive && 'text-primary hover:no-underline'
              )}
            >
              <ImagesIcon className='mr-1.5 size-4' /> Media
            </CustomLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
