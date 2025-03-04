import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  label: string;
  placeholder?: string;
  defaultValue: string;
  onChange: (v: string) => void;
};
export function TextInput({
  label,
  placeholder,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <Label className='font-normal'>{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(ev) => {
          const v = ev.target.value;
          setValue(v);
          onChange(v);
        }}
        className='w-full'
      />
    </div>
  );
}
