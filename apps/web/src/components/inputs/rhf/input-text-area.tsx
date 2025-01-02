'use client';

import { lowerCase, startCase } from '@repo/shared/lib/utils';
import {
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
import { Textarea } from '@/components/ui/textarea';

type Props<T extends FieldValues> =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    control: Control<T>;
    label?: string;
    name: Path<T>;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    withLabel?: boolean;
    mandatory?: boolean;
    //! classNames
    containerCN?: string;
    labelCN?: string;
    inputWrapperCN?: string;
    inputCN?: string;
  };

export default function InputTextArea<T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  disabled,
  mandatory,
  withLabel = true,
  //! classNames
  containerCN,
  labelCN,
  inputCN,
  ...props
}: Props<T>) {
  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
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
            <FormLabel className={cn(labelCN)}>
              {label || startCase(name)}
              {mandatory && <span className='text-[#f00]'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
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
              onChange={(e) => onChange(e, field)}
              className={cn(inputCN)}
              rows={5}
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}
