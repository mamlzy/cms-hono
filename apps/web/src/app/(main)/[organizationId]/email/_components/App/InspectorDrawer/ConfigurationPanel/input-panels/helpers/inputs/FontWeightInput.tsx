import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
};
export function FontWeightInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div>
      <Label className='font-normal'>{label}</Label>
      <ToggleGroup
        type='single'
        defaultValue={value}
        onValueChange={(fontWeight) => {
          setValue(fontWeight);
          onChange(fontWeight);
        }}
      >
        <ToggleGroupItem value='normal' className='flex-1'>
          Regular
        </ToggleGroupItem>
        <ToggleGroupItem value='bold' className='flex-1'>
          Bold
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
