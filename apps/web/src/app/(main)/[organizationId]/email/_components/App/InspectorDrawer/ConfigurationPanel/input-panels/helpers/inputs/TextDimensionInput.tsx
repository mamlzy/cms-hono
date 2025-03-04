import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TextDimensionInputProps = {
  label: string;
  defaultValue: number | null | undefined;
  onChange: (v: number | null) => void;
};
export function TextDimensionInput({
  label,
  defaultValue,
  onChange,
}: TextDimensionInputProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = parseInt(ev.target.value, 10);
    onChange(Number.isNaN(value) ? null : value);
  };

  return (
    <div>
      <Label className='font-normal'>{label}</Label>
      <div className='flex items-center gap-1'>
        <Input
          type='number'
          onChange={handleChange}
          defaultValue={defaultValue || undefined}
          className='h-7 flex-1'
        />
        <span>px</span>
      </div>
    </div>
  );
}
