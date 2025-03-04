import { useState } from 'react';
import {
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartHorizontalIcon,
  AlignStartVerticalIcon,
} from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RawSliderInput } from './raw/RawSliderInput';

type TPaddingValue = {
  top: number;
  bottom: number;
  right: number;
  left: number;
};
type Props = {
  label: string;
  defaultValue: TPaddingValue | null;
  onChange: (value: TPaddingValue) => void;
};
export function PaddingInput({ label, defaultValue, onChange }: Props) {
  const [value, setValue] = useState(() => {
    if (defaultValue) {
      return defaultValue;
    }
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
  });

  function handleChange(internalName: keyof TPaddingValue, nValue: number) {
    const v = {
      ...value,
      [internalName]: nValue,
    };
    setValue(v);
    onChange(v);
  }

  return (
    <div className='items-start gap-2 pb-px'>
      <Label className='mb-2 inline-block font-normal'>{label}</Label>

      <div className='space-y-4'>
        <RawSliderInput
          iconLabel={<AlignStartVerticalIcon strokeWidth='1.5' />}
          value={value.top}
          setValue={(num) => handleChange('top', num)}
          units='px'
          step={4}
          min={0}
          max={80}
        />
        <RawSliderInput
          iconLabel={<AlignEndVerticalIcon strokeWidth='1.5' />}
          value={value.bottom}
          setValue={(num) => handleChange('bottom', num)}
          units='px'
          step={4}
          min={0}
          max={80}
        />
        <RawSliderInput
          iconLabel={<AlignStartHorizontalIcon strokeWidth='1.5' />}
          value={value.left}
          setValue={(num) => handleChange('left', num)}
          units='px'
          step={4}
          min={0}
          max={80}
        />
        <RawSliderInput
          iconLabel={<AlignEndHorizontalIcon strokeWidth='1.5' />}
          value={value.right}
          setValue={(num) => handleChange('right', num)}
          units='px'
          step={4}
          min={0}
          max={80}
        />
      </div>
    </div>
  );
}
