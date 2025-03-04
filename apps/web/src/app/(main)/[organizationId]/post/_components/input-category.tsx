import { useEffect, useState } from 'react';
import {
  categoryRequest,
  type CategoryGetAll,
} from '@/requests/category.request';
import type { CreatePostSchema, QsCategorySchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';
import { useQuery } from '@tanstack/react-query';
import { BoxIcon, CheckIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import {
  useController,
  useFormContext,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';

import { useCurrentOrganizationId } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

type TCategory = CreatePostSchema['categories'][number];

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  mandatory?: boolean;
};

export function InputCategory<T extends FieldValues>({
  control,
  name,
  mandatory,
}: Props<T>) {
  const { field } = useController<T>({
    control,
    name,
    defaultValue: [] as any,
  });
  const { setValue } = useFormContext<T>();

  const currentOrganizationId = useCurrentOrganizationId();

  const [showSheet, setShowSheet] = useState(false);
  const [tempCategories, setTempCategories] = useState<TCategory[]>([]);

  //! watch `field.value` to sync `tempCategories`
  useEffect(() => {
    setTempCategories(field.value);
  }, [field.value, showSheet]);

  const categoriesQs: ToQueryString<QsCategorySchema> = {
    organizationId: currentOrganizationId,
  };
  const categoriesQuery = useQuery({
    queryKey: ['categories', categoriesQs],
    queryFn: () => categoryRequest.getAll(categoriesQs),
  });

  const handleSelect = (category: CategoryGetAll) => {
    let categories: CreatePostSchema['categories'] = [];

    const isSelected = tempCategories.find(
      (tempCategory) => tempCategory.id === category.id
    );

    if (isSelected) {
      categories = tempCategories.filter(
        (tempCategory) => tempCategory.id !== category.id
      );

      setTempCategories(categories);

      return;
    }

    categories = [
      ...tempCategories,
      {
        id: category.id,
        title: category.title,
      },
    ];

    setTempCategories(categories);
  };

  const handleSave = () => {
    setValue(name, tempCategories as any);
  };

  const handleRemove = ({ categoryId }: { categoryId: string }) => {
    setValue(
      name,
      (field.value as TCategory[]).filter(
        (category) => category.id !== categoryId
      ) as any
    );
  };

  return (
    <div className='space-y-4 rounded-xl border p-3'>
      <Label className='block text-xl'>
        Categories{mandatory && <span className='text-[#f00]'>*</span>}
      </Label>

      <div className='space-y-1'>
        {(field.value as TCategory[]).map((category) => (
          <div
            key={category.id}
            className='group grid grid-cols-[1fr_auto] items-center gap-4 rounded-md bg-secondary/40 p-1 hover:bg-primary/20'
          >
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <div className='grid size-9 place-items-center rounded-lg bg-secondary'>
                  <BoxIcon className='size-4' />
                </div>
                <span className='text-lg font-bold text-primary'>
                  {category.title}
                </span>
              </div>
            </div>

            <Button
              variant='secondary'
              size='icon'
              onClick={() => handleRemove({ categoryId: category.id })}
              className='hidden group-hover:inline-flex'
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>

      <div className='grid place-items-end'>
        <Sheet open={showSheet} onOpenChange={setShowSheet}>
          <SheetTrigger asChild>
            <Button variant='secondary' className=''>
              Select Categories
            </Button>
          </SheetTrigger>
          <SheetContent className='grid w-full grid-rows-[auto_1fr_auto] sm:max-w-xl'>
            <SheetHeader>
              <SheetTitle className='text-xl'>Select Categories</SheetTitle>
              <SheetDescription className='sr-only'>
                select categories sheet
              </SheetDescription>
              <Separator />
            </SheetHeader>
            <div className='overflow-auto'>
              <div className='grid grid-cols-1 items-start gap-4 py-4'>
                {categoriesQuery.isPending &&
                  Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton key={idx} className='h-10' />
                  ))}

                {categoriesQuery.isSuccess &&
                  categoriesQuery.data.data.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      tempCategories={tempCategories}
                      handleSelect={handleSelect}
                    />
                  ))}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type='button' variant='secondary' size='lg'>
                  Cancel
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button type='submit' size='lg' onClick={handleSave}>
                  Save changes
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function CategoryItem({
  tempCategories,
  category,
  handleSelect,
}: {
  tempCategories: TCategory[];
  category: CategoryGetAll;
  handleSelect: (category: CategoryGetAll) => void;
}) {
  const isSelected = tempCategories.find(
    (tempCategory) => tempCategory.id === category.id
  );

  return (
    <div key={category.id} className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <div className='grid size-9 place-items-center rounded-lg bg-secondary'>
          <BoxIcon className='size-4' />
        </div>
        <span className='text-lg font-bold text-primary'>{category.title}</span>
      </div>

      {isSelected ? (
        <Button
          variant='secondary'
          size='lg'
          onClick={() => handleSelect(category)}
          className='text-primary'
        >
          <CheckIcon /> Added
        </Button>
      ) : (
        <Button
          variant='secondary'
          size='lg'
          onClick={() => handleSelect(category)}
          className=''
        >
          <PlusIcon /> Add
        </Button>
      )}
    </div>
  );
}
