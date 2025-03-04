import { useState, type JSX } from 'react';

import { Label } from '@/components/ui/label';
import { RawSliderInput } from './raw/RawSliderInput';

type SliderInputProps = {
  label: string;
  iconLabel: JSX.Element;

  step?: number;
  units: string;
  min?: number;
  max?: number;

  defaultValue: number;
  onChange: (v: number) => void;
};

export function SliderInput({
  label,
  defaultValue,
  onChange,
  ...props
}: SliderInputProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className='flex flex-col items-start gap-1'>
      <Label className='font-normal'>{label}</Label>
      <RawSliderInput
        value={value}
        setValue={(value: number) => {
          setValue(value);
          onChange(value);
        }}
        {...props}
      />
    </div>
  );
}
