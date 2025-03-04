import { useState } from 'react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
  label: string;
  defaultValue: string | null;
  onChange: (value: string | null) => void;
};
export function TextAlignInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue ?? 'left');

  return (
    <div>
      <Label className='font-normal'>{label}</Label>
      <ToggleGroup
        type='single'
        defaultValue={value}
        onValueChange={(value) => {
          setValue(value);
          onChange(value);
        }}
      >
        <ToggleGroupItem value='left' className='flex-1'>
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value='center' className='flex-1'>
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value='right' className='flex-1'>
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
