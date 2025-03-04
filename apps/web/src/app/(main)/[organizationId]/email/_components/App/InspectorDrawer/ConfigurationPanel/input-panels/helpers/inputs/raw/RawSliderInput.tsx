import { type JSX } from 'react';

import { Slider } from '@/components/ui/slider';

type SliderInputProps = {
  iconLabel: JSX.Element;

  step?: number;
  units: string;
  min?: number;
  max?: number;

  value: number;
  setValue: (v: number) => void;
};

export function RawSliderInput({
  iconLabel,
  value,
  setValue,
  units,
  ...props
}: SliderInputProps) {
  return (
    <div className='flex w-full items-center justify-between gap-2'>
      <div style={{ minWidth: 24, lineHeight: 1, flexShrink: 0 }}>
        {iconLabel}
      </div>
      <Slider
        {...props}
        value={[value]}
        onValueChange={(newValue) => setValue(newValue[0])}
      />
      <div>
        <p className='min-w-[43px] shrink-0 text-right text-sm'>
          {value}
          {units}
        </p>
      </div>
    </div>
  );
}
