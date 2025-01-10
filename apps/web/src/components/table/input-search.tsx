import React from 'react';
import { Option } from '@repo/shared/types';

import { cn } from '@/lib/utils';
import InputTextBasic from '@/components/inputs/basic/input-text-basic';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type InputSearchProps<T extends React.Dispatch<React.SetStateAction<any>>> = {
  searchBy: string;
  searchKey: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: T;
  options: Option[];
  containerCN?: string;
};

export default function InputSearch<
  T extends React.Dispatch<React.SetStateAction<any>>,
>({
  searchBy,
  searchKey,
  onInputChange,
  onSelectChange,
  options,
  containerCN,
}: InputSearchProps<T>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center',
        containerCN
      )}
    >
      <Select value={searchBy} onValueChange={onSelectChange}>
        <SelectTrigger className='h-auto min-h-9 w-max'>
          <SelectValue placeholder='Filter by' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <InputTextBasic
        name={searchBy}
        value={searchKey}
        onChange={onInputChange}
        containerCN='sm:order-[0]'
      />
    </div>
  );
}
