import { useState } from 'react';
import Image from 'next/image';
import { folderRequest } from '@/requests/folder.request';
import { mediaRequest } from '@/requests/media.request';
import { useDebouncedValue } from '@mantine/hooks';
import type { QsFolderSchema, QsMediaSchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Loader2Icon, SearchIcon } from 'lucide-react';

import { useCurrentOrganizationId } from '@/lib/navigation';
import { getNextPageParamFn } from '@/lib/react-query';
import { Input } from '@/components/ui/input';
import { ComboboxPaginateBasic } from '../inputs/basic/combobox-paginate-basic';
import type { MediaDialogProps } from './types';

export function LibraryTab({
  onSelectImage,
}: Pick<MediaDialogProps, 'onSelectImage'>) {
  const currentOrganizationId = useCurrentOrganizationId();

  const [folderValue, setFolderValue] = useState<string | null>(null);
  const [folderSearch, setFolderSearch] = useState('');
  const [folderSearchDebounce] = useDebouncedValue(folderSearch, 300);
  const folderQs: ToQueryString<QsFolderSchema> = {
    name: folderSearchDebounce,
  };
  const foldersInifiniteQuery = useInfiniteQuery({
    queryKey: ['folders', folderQs],
    queryFn: ({ pageParam }) =>
      folderRequest.getAll({
        ...folderQs,
        page: String(pageParam),
      }),
    getNextPageParam: getNextPageParamFn,
    initialPageParam: 1,
  });

  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaSearchDebounce] = useDebouncedValue(mediaSearch, 300);
  const mediaQs: ToQueryString<QsMediaSchema> = {
    folderId: folderValue || undefined,
    name: mediaSearchDebounce,
  };
  const mediasQuery = useQuery({
    queryKey: ['medias', mediaQs],
    queryFn: () => mediaRequest.getAll(mediaQs),
  });

  return (
    <>
      <div className='mb-4 flex items-center gap-2'>
        {/* Search Media */}
        <div className='relative flex-1'>
          <SearchIcon className='absolute left-2 top-1/2 -translate-y-1/2' />
          <Input
            value={mediaSearch}
            onChange={(e) => setMediaSearch(e.target.value)}
            className='h-10 bg-accent pl-11 text-lg'
          />
        </div>

        {/* Folder Combobox */}
        <ComboboxPaginateBasic
          placeholder='All folders'
          optionValue='id'
          optionLabel={(folder) => `📁 ${folder.name}`}
          query={foldersInifiniteQuery}
          getSingleFn={folderRequest.getById}
          value={folderValue}
          setValue={setFolderValue}
          search={folderSearch}
          setSearch={setFolderSearch}
          mandatory
          inputClassname='h-10 py-1'
        />
      </div>

      {mediasQuery.isPending && (
        <div>
          <Loader2Icon className='size-8 animate-spin' />
        </div>
      )}

      <div className='3xl:grid-cols-6 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 2xl:grid-cols-5'>
        {mediasQuery.isSuccess &&
          (mediasQuery.data.length > 0 ? (
            mediasQuery.data.map((media) => {
              const mediaSrc = `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${currentOrganizationId}${media.folderId ? `/${media.folderId}` : ''}${media.url}`;

              return (
                <div
                  key={media.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => onSelectImage(media)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectImage(media);
                    }
                  }}
                >
                  <div className='relative'>
                    <Image
                      src={mediaSrc}
                      alt={media.originalName}
                      sizes='100vw'
                      className='h-36 w-full rounded-2xl object-cover xl:h-52'
                      width={0}
                      height={0}
                      quality={100}
                    />
                  </div>
                  <p className='truncate text-sm'>{media.originalName}</p>
                  <p className='text-sm text-muted-foreground'>{media.size}</p>
                </div>
              );
            })
          ) : (
            <p className='text-muted-foreground'>No media.</p>
          ))}
      </div>
    </>
  );
}
