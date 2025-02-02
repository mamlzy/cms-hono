import { useState } from 'react';
import { lowerCase, startCase } from '@repo/shared/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
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
    mandatory?: boolean;
    withLabel?: boolean;
    containerCN?: string;
    labelCN?: string;
    inputCN?: string;
  };

export function InputPassword<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  disabled,
  mandatory,
  withLabel = true,
  containerCN,
  labelCN,
  inputCN,
  ...props
}: Props<T>) {
  const [show, setShow] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<any>
  ) => {
    field.onChange(e.target.value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(containerCN)}>
          {withLabel && (
            <FormLabel className={cn('', labelCN)}>
              {label || startCase(name)}
              {mandatory && <span className='text-[#f00]'>*</span>}
            </FormLabel>
          )}
          <div className='relative flex'>
            <FormControl>
              <Input
                type={show ? 'text' : 'password'}
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
              />
            </FormControl>

            {show ? (
              <Eye
                className='absolute right-[12px] top-1/2 size-[1.1rem] -translate-y-1/2 cursor-pointer'
                onClick={() => setShow(false)}
              />
            ) : (
              <EyeOff
                className='absolute right-[12px] top-1/2 size-[1.1rem] -translate-y-1/2 cursor-pointer'
                onClick={() => setShow(true)}
              />
            )}
          </div>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
