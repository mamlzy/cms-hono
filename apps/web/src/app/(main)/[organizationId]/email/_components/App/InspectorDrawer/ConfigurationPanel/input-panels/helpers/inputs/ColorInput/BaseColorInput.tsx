import { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Picker } from './Picker';

type Props =
  | {
      nullable: true;
      label: string;
      onChange: (value: string | null) => void;
      defaultValue: string | null;
    }
  | {
      nullable: false;
      label: string;
      onChange: (value: string) => void;
      defaultValue: string;
    };

export function ColorInput({ label, defaultValue, onChange, nullable }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const renderResetButton = () => {
    if (!nullable) {
      return null;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return (
      <Button
        variant='outline'
        size='icon'
        onClick={() => {
          setValue(null);
          onChange(null);
        }}
        className='size-8'
      >
        <XIcon />
      </Button>
    );
  };

  const renderOpenButton = () => {
    if (value) {
      return (
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            onClick={() => setOpen(true)}
            className='size-8 p-0'
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
      );
    }

    return (
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setOpen(true)}
          className='size-8'
        >
          <PlusIcon />
        </Button>
      </PopoverTrigger>
    );
  };

  return (
    <div className='flex flex-col items-start'>
      <Label className='mb-[0.5px] font-normal'>{label}</Label>
      <div className='flex flex-row gap-1'>
        <Popover open={open} onOpenChange={setOpen}>
          {renderOpenButton()}
          <PopoverContent align='start' className='w-auto p-0'>
            <Picker
              value={value || ''}
              onChange={(v) => {
                setValue(v);
                onChange(v);
              }}
            />
          </PopoverContent>
        </Popover>
        {renderResetButton()}
      </div>
    </div>
  );
}
