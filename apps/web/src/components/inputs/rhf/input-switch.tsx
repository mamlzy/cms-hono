import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
};

export function InputSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: Props<T>) {
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className='flex max-w-md flex-row items-center justify-between rounded-lg border px-3 py-2 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage className='text-xs' />
          </FormItem>
        )}
      />
    </div>
  );
}
