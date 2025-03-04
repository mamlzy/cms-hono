import { useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FONT_FAMILIES } from '../../../../../../documents/blocks/helpers/fontFamily';

const OPTIONS = FONT_FAMILIES.map((option) => (
  <SelectItem
    key={option.key}
    value={option.key}
    style={{
      fontFamily: option.value,
    }}
  >
    {option.label}
  </SelectItem>
));

type NullableProps = {
  label: string;
  onChange: (value: null | string) => void;
  defaultValue: null | string;
};
export function NullableFontFamily({
  label,
  onChange,
  defaultValue,
}: NullableProps) {
  const [value, setValue] = useState(defaultValue ?? 'inherit');

  return (
    <div>
      <Label className='font-normal'>{label}</Label>
      <Select
        value={value}
        onValueChange={(value) => {
          setValue(value);
          onChange(value === null ? null : value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder='Match email settings' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='inherit'>Match email settings</SelectItem>
          <SelectGroup>{OPTIONS}</SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
