'use client';

import { forwardRef, RefObject } from 'react';
import { lowerCase } from '@repo/shared/lib/utils';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

type Props = {
  ref?: RefObject<HTMLInputElement>;
  label?: string;
  name?: string;
  id?: string;
  defaultValue?: string | number;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
  containerCN?: string;
  labelCN?: string;
  inputWrapperCN?: string;
  inputCN?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const InputTextBasic = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      name,
      id,
      defaultValue,
      value,
      onChange,
      placeholder,
      disabled,
      mandatory,
      containerCN,
      labelCN,
      inputWrapperCN,
      inputCN,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', containerCN)}>
        {label ? (
          <Label htmlFor={id || name} className={cn(labelCN)}>
            {label}
            {mandatory && <span className='text-[#f00]'>*</span>}
          </Label>
        ) : null}

        <div
          className={cn(
            'relative flex items-center overflow-hidden rounded-md border border-input focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary',
            inputWrapperCN
          )}
        >
          <input
            ref={ref}
            type='text'
            defaultValue={defaultValue}
            value={ref ? undefined : value || ''}
            id={id || name}
            className={cn(
              'h-9 w-full bg-background px-2 text-sm font-normal outline-none placeholder:text-sm placeholder:font-normal disabled:bg-muted',
              inputCN
            )}
            placeholder={
              !disabled
                ? placeholder ||
                  label ||
                  (name ? `Enter ${lowerCase(name)}...` : 'Type something...')
                : undefined
            }
            disabled={disabled}
            onChange={onChange}
            onKeyDown={onKeyDown}
            {...props}
          />
        </div>
      </div>
    );
  }
);

export default InputTextBasic;
