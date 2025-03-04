import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { type TEditorBlock } from '../../../../editor/core';
import { BlockTypeButton } from './BlockButton';
import { BUTTONS } from './buttons';
import { DividerButton } from './DividerButton';
import { PlaceholderButton } from './PlaceholderButton';

type Props = {
  placeholder?: boolean;
  onSelect: (block: TEditorBlock) => void;
};
export function AddBlockButton({ onSelect, placeholder }: Props) {
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null);
  const [showBlocksMenu, setShowBlocksMenu] = useState(false);

  const handleButtonClick = () => {
    setShowBlocksMenu((prev) => !prev);
  };

  const renderButton = () => {
    if (placeholder) {
      return <PlaceholderButton onClick={handleButtonClick} />;
    }
    return (
      <DividerButton
        buttonElement={buttonElement}
        onClick={handleButtonClick}
      />
    );
  };

  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu open={showBlocksMenu} onOpenChange={setShowBlocksMenu}>
        <div
          ref={setButtonElement}
          className='relative flex w-full items-center justify-center'
        >
          {renderButton()}
        </div>
        <DropdownMenuContent className=''>
          <div className='grid grid-cols-4 gap-1.5 p-[1.5px]'>
            {BUTTONS.map((button, i) => (
              <BlockTypeButton
                key={i}
                label={button.label}
                icon={button.icon}
                onClick={() => onSelect(button.block())}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
