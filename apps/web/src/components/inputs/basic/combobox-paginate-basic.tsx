/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { lowerCase, startCase } from '@repo/shared/lib/utils';
import { type Res } from '@repo/shared/types';
import {
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import {
  CheckIcon,
  ChevronDown,
  Loader2Icon,
  LoaderIcon,
  SearchIcon,
  X,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props<
  TData extends Record<string, any>,
  TOptionValue extends keyof TData,
  TOptionLabel extends keyof TData,
> = {
  query: UseInfiniteQueryResult<InfiniteData<Res<TData[]>, unknown>, Error>;
  value: TData[TOptionValue] | null;
  setValue: React.Dispatch<React.SetStateAction<TData[TOptionValue] | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  optionValue: TOptionValue;
  optionLabel: keyof TData | ((option: TData) => string | boolean);
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  mandatory?: boolean;
  disabled?: boolean;
  containerCN?: string;
  inputClassname?: string;
  additionalOnChange?: (option: TData) => void;
  additionalOnClear?: () => void;
  getSingleFn: (id: TData[TOptionValue]) => Promise<
    Res<{
      [K in TOptionValue | TOptionLabel]: TData[K];
    }>
  >;
  endingOptionComponent?:
    | React.ReactNode
    | ((
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
      ) => React.ReactNode);
};

export function ComboboxPaginateBasic<
  TData extends Record<string, any>,
  TOptionValue extends keyof TData,
  TOptionLabel extends keyof TData,
>({
  query,
  value,
  setValue,
  search,
  setSearch,
  optionValue,
  optionLabel,
  name,
  id,
  label,
  placeholder,
  mandatory,
  disabled,
  containerCN,
  inputClassname,
  additionalOnChange,
  additionalOnClear,
  getSingleFn,
  endingOptionComponent,
}: Props<TData, TOptionValue, TOptionLabel>) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TData | null>(null);
  const [isPending, setIsPending] = useState(false);

  const options = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) || [],
    [query.data]
  );

  const getOptionLabel = (option: TData) =>
    typeof optionLabel === 'function'
      ? optionLabel(option)
      : option[optionLabel];

  const fetchSingle = useCallback(
    async (v: TData[TOptionValue]) => {
      setIsPending(true);

      try {
        const { data } = await getSingleFn(v);

        setSelected(data as TData);
      } catch (err) {
        console.error('err =>', err);
        toast.error(`Error, Cant get ${` ${label || placeholder}`} data`);

        setSelected(null);
        setValue('' as TData[TOptionValue]);
      } finally {
        setIsPending(false);
      }
    },
    [value]
  );

  useEffect(() => {
    //! reset search on every value changes
    setSearch('');

    //! if value empty, but selected not empty, reset
    if (!value && selected?.[optionValue] !== value) {
      setSelected(null);
    }

    //! if value not empty, but selected empty, fetch (to get the option label)
    if (value && selected?.[optionValue] !== value) {
      fetchSingle(value);
    }
  }, [value]);

  const onChange = (option: TData) => {
    //! if value the same, reset/clear.
    if (option[optionValue] === value) {
      setValue('' as TData[TOptionValue]);
      setSelected(null);

      additionalOnClear?.();
      setSearch('');
      setOpen(false);
      return;
    }

    //! set value
    setValue(option[optionValue]);
    setSelected(option);

    additionalOnChange?.(option);
    setSearch('');
    setOpen(false);
  };

  const onClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setValue(null as TData[TOptionValue]);
    setSelected(null);

    additionalOnClear?.();
    setOpen(false);
  };

  useEffect(() => {
    setSearch('');
  }, [value]);

  //! Infinite scroll logic
  const { ref: infiniteRef, inView } = useInView();
  useEffect(() => {
    if (inView && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [inView, query.hasNextPage]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <div className={containerCN}>
        {label && (
          <Label htmlFor={id || name}>
            {label || startCase(name!)}
            {mandatory && <span className='text-[#f00]'>*</span>}
          </Label>
        )}

        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'group relative w-full min-w-12 justify-start px-2 font-normal hover:bg-accent disabled:bg-muted disabled:opacity-100 data-[state=open]:border-transparent data-[state=open]:ring-2 data-[state=open]:ring-primary',
              inputClassname
            )}
            disabled={disabled}
          >
            {/* Value / Placeholder */}
            <span
              className={cn(
                'block truncate text-start',
                value && !disabled
                  ? 'pr-[42px]'
                  : 'pr-[20px] text-muted-foreground'
              )}
            >
              {selected
                ? getOptionLabel(selected)
                : placeholder ||
                  label ||
                  (name ? `Select ${lowerCase(name)}...` : undefined)}
            </span>

            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center transition-colors'
              )}
            >
              {/* CLOSE BUTTON */}
              <div
                className={cn(
                  'hidden h-full shrink-0 place-items-center',
                  value && !disabled && 'grid'
                )}
              >
                <span
                  className='hover:bg-grayish/50 rounded-md p-1 opacity-50'
                  onClick={onClear}
                  role='button'
                  tabIndex={0}
                >
                  <X size={16} />
                  <span className='sr-only'>clear button</span>
                </span>
              </div>

              {/* CHEVRON ICON */}
              <div className='mr-2 grid h-full place-items-center'>
                {isPending || query.isPending ? (
                  <LoaderIcon size={16} className='animate-spin opacity-50' />
                ) : (
                  <ChevronDown size={16} className='shrink-0 opacity-50' />
                )}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className='w-[--radix-popover-trigger-width] min-w-[200px] p-0'>
        <div>
          {/* Search input */}
          <div className='relative w-full'>
            <SearchIcon className='absolute left-3 top-1/2 h-full w-4 -translate-y-1/2 opacity-50' />
            <Input
              placeholder='Search...'
              className='w-full rounded-b-none border-none pl-10 outline-none ring-offset-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label='Search'
            />
          </div>
          <div className='max-h-60 w-full overflow-y-auto p-1'>
            {query.isPending ? (
              //! Loading Indicator
              <div className='flex items-center justify-center p-1'>
                <Loader2Icon className='animate-spin' />
              </div>
            ) : query.isError ? (
              //! Error Component
              <div className='py-6 text-center text-sm'>
                Error, something went wrong
              </div>
            ) : options.length < 1 ? (
              //! Empty Component
              <div className='py-6 text-center text-sm'>No option found.</div>
            ) : (
              <>
                {/* Option Component */}
                {options.map((option) => {
                  const isSelected = value === option[optionValue];

                  return (
                    <div
                      key={option[optionValue]}
                      tabIndex={0}
                      onClick={() => onChange(option)}
                      role='option'
                      aria-selected={isSelected}
                      className='flex cursor-default items-center justify-between rounded-sm p-2 hover:bg-accent focus-visible:bg-accent focus-visible:outline-primary'
                    >
                      <span className='text-sm leading-none'>
                        {getOptionLabel(option)}
                      </span>

                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </div>
                  );
                })}

                {typeof endingOptionComponent === 'function'
                  ? endingOptionComponent(setOpen)
                  : endingOptionComponent}
              </>
            )}

            {/* Infinite scroll trigger */}
            <div
              ref={infiniteRef}
              className='w-full text-center text-muted-foreground'
            >
              {query.isFetchingNextPage && (
                //! Loading Indicator
                <div className='flex items-center justify-center p-1'>
                  <Loader2Icon className='animate-spin' />
                </div>
              )}

              {!query.isFetchingNextPage &&
                !query.hasNextPage &&
                options.length > 0 && (
                  <span className='text-xs'>No more options</span>
                )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
