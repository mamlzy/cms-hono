import { useState } from 'react';
import { ALargeSmallIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RawSliderInput } from './raw/RawSliderInput';

type Props = {
  label: string;
  defaultValue: number;
  onChange: (v: number) => void;
};
export function FontSizeInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (value: number) => {
    setValue(value);
    onChange(value);
  };
  return (
    <div className='flex-col items-start'>
      <Label className='font-normal'>{label}</Label>
      <RawSliderInput
        iconLabel={<ALargeSmallIcon />}
        value={value}
        setValue={handleChange}
        units='px'
        step={1}
        min={10}
        max={48}
      />
    </div>
  );
}
