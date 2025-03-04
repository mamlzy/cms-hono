import React from 'react';
import { ChevronLastIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/sidebar/ui/sidebar';
import { Button } from '@/components/ui/button';

export function ToggleSidebarButton() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button variant='outline' size='icon' onClick={toggleSidebar}>
      <ChevronLastIcon className={cn(open ? 'rotate-180' : 'rotate-0')} />
    </Button>
  );
}
