import React from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Props = {
  onClick: () => void;
};
export function PlaceholderButton({ onClick }: Props) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
        className='size-8 rounded-full'
      >
        <PlusIcon />
      </Button>
    </DropdownMenuTrigger>
  );
}
