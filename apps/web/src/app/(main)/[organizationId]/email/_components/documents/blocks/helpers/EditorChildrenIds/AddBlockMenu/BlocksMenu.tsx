import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { type TEditorBlock } from '../../../../editor/core';
import { BlockTypeButton } from './BlockButton';
import { BUTTONS } from './buttons';

type BlocksMenuProps = {
  open: boolean;
  onOpenChange: (bool: boolean) => void;
  onSelect: (block: TEditorBlock) => void;
};
export function BlocksMenu({ open, onOpenChange, onSelect }: BlocksMenuProps) {
  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    onOpenChange(false);
  };

  if (open === null) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent className='w-56'>
        <div className='grid grid-cols-4 p-px'>
          {BUTTONS.map((k, i) => (
            <BlockTypeButton
              key={i}
              label={k.label}
              icon={k.icon}
              onClick={() => onClick(k.block())}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
