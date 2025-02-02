'use client';

import { lowerCase, startCase } from '@repo/shared/lib/utils';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props<T extends FieldValues> =
  React.InputHTMLAttributes<HTMLInputElement> & {
    control: Control<T>;
    label?: string;
    name: Path<T>;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    withLabel?: boolean;
    mandatory?: boolean;
    containerCN?: string;
    inputWrapperCN?: string;
    inputCN?: string;
    overrideOnChange?: (
      e: React.ChangeEvent<HTMLInputElement>,
      field: ControllerRenderProps<FieldValues, string>
    ) => void;
    additionalOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    stringMode?: boolean;
  };

export default function InputNumber<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  disabled,
  withLabel = true,
  mandatory,
  containerCN,
  inputCN,
  overrideOnChange,
  additionalOnChange,
  stringMode,
  ...props
}: Props<T>) {
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<any>
  ) => {
    if (overrideOnChange) {
      overrideOnChange(e, field);
      return;
    }

    const val = e.target.value;

    field.onChange(stringMode ? val : val === '' ? val : Number(val));
    additionalOnChange?.(e);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerCN)}>
          {withLabel && (
            <FormLabel>
              {label || startCase(name)}
              {mandatory && <span className='text-[#f00]'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type='number'
              placeholder={
                !disabled
                  ? placeholder ||
                    label ||
                    `Enter ${lowerCase(name)}...` ||
                    'Type something...'
                  : undefined
              }
              {...props}
              {...field}
              className={cn(inputCN)}
              onChange={(e) => onChange(e, field)}
              onKeyDown={(e) => {
                //! prevent 'e', 'E' , '+' keys from being entered
                const keys = [
                  'e',
                  'E',
                  '+',
                  ...(stringMode ? ['-', '.', ','] : []),
                ];

                if (keys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onWheelCapture={(e) => {
                //! disable scroll onChange
                e.currentTarget.blur();
              }}
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
