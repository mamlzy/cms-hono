'use client';

import * as React from 'react';
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
    placeholder?: string;
    disabled?: boolean;
    mandatory?: boolean;
    uppercase?: boolean;
    withLabel?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputWrapperCN?: string;
    inputClassName?: string;
    noErrorMessage?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };

export function InputText<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  disabled,
  mandatory,
  uppercase = false,
  withLabel = true,
  containerClassName,
  labelClassName,
  // inputWrapperCN,
  inputClassName,
  // noErrorMessage,
  onChange: customOnChange,
  ...props
}: Props<T>) {
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<any>
  ) => {
    customOnChange?.(e);
    if (!uppercase) {
      field.onChange(e.target.value);
      return;
    }

    //! UpperCase Logic
    const { selectionStart, selectionEnd } = e.target;
    e.target.value = e.target.value.toUpperCase();
    e.target.setSelectionRange(selectionStart, selectionEnd);

    field.onChange(e.target.value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerClassName)}>
          {withLabel && (
            <FormLabel className={cn('', labelClassName)}>
              {label || startCase(name)}
              {mandatory && <span className='text-[#f00]'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
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
              className={cn(inputClassName)}
              onChange={(e) => onChange(e, field)}
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
