import { useState, type JSX } from 'react';

import { Label } from '@/components/ui/label';
import { ToggleGroup } from '@/components/ui/toggle-group';

type Props = {
  label: string | JSX.Element;
  defaultValue: string;
  children: React.ReactNode;
  onChange: (v: string) => void;
};
export function RadioGroupInput({
  label,
  defaultValue,
  onChange,
  children,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className='flex flex-col'>
      <Label className='font-normal'>{label}</Label>
      <ToggleGroup
        type='single'
        value={value}
        onValueChange={(v) => {
          setValue(v);
          onChange(v);
        }}
      >
        {children}
      </ToggleGroup>
    </div>
  );
}
