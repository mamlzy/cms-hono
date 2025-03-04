import React from 'react';

import { Button } from '@/components/ui/button';

type BlockMenuButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function BlockTypeButton({
  label,
  icon,
  onClick,
}: BlockMenuButtonProps) {
  return (
    <Button
      variant='outline'
      onClick={(ev) => {
        ev.stopPropagation();
        onClick();
      }}
      className='flex h-auto flex-col gap-0 p-2'
    >
      <div className='mb-[0.75px] flex justify-center p-px'>{icon}</div>
      <p>{label}</p>
    </Button>
  );
}
