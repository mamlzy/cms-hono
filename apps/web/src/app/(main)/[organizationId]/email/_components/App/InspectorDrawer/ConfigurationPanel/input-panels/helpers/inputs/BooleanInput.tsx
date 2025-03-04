import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Props = {
  label: string;
  defaultValue: boolean;
  onChange: (value: boolean) => void;
};

export function BooleanInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className='flex items-center gap-2'>
      <Switch
        checked={value}
        onCheckedChange={(checked: boolean) => {
          setValue(checked);
          onChange(checked);
        }}
      />
      <Label className='font-normal'>{label}</Label>
    </div>
  );
}
