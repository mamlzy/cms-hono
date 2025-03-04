import { useState } from 'react';
import { folderRequest } from '@/requests/folder.request';
import { useDebouncedValue } from '@mantine/hooks';
import type { QsFolderSchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UploadCloudIcon } from 'lucide-react';

import { getNextPageParamFn } from '@/lib/react-query';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CreateFolderDialog } from '../create-folder-dialog';
import { ComboboxPaginateBasic } from '../inputs/basic/combobox-paginate-basic';
import type { MediaDialogProps } from './types';

export function UploadTab({
  getInputProps,
  getRootProps,
  uploadDisabled,
  selectedFolderId,
  setSelectedFolderId,
}: Pick<
  MediaDialogProps,
  | 'getInputProps'
  | 'getRootProps'
  | 'uploadDisabled'
  | 'selectedFolderId'
  | 'setSelectedFolderId'
>) {
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);

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

  return (
    <>
      {/* Folder Combobox */}
      <ComboboxPaginateBasic
        placeholder='Select folder...'
        optionValue='id'
        optionLabel={(folder) => `📁 ${folder.name}`}
        query={foldersInifiniteQuery}
        getSingleFn={folderRequest.getById}
        value={selectedFolderId}
        setValue={setSelectedFolderId}
        search={folderSearch}
        setSearch={setFolderSearch}
        mandatory
        endingOptionComponent={(setPopoverOpen) => (
          <div
            tabIndex={0}
            onClick={() => {
              setShowCreateFolderDialog(true);
              setPopoverOpen(false);
            }}
            role='button'
            className='flex cursor-default items-center justify-between rounded-sm p-2 text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-primary'
          >
            <span className='flex items-center'>➕ New Folder</span>
          </div>
        )}
        inputClassname='h-10 mb-4'
      />

      <div className='size-full'>
        <label
          {...getRootProps()}
          className={cn(
            'relative flex size-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:bg-neutral-900/80',
            uploadDisabled && 'pointer-events-none opacity-50'
          )}
        >
          <div className='text-center'>
            <div className='mx-auto max-w-min rounded-md border p-2'>
              <UploadCloudIcon size={20} />
            </div>

            <p className='mt-2 text-sm text-muted-foreground'>
              <span className='font-semibold'>Drag file</span>
            </p>
            <p className='text-xs text-muted-foreground'>
              Click to upload file (files should be under 2 MB)
            </p>
          </div>
        </label>

        <Input
          {...getInputProps()}
          id='dropzone-file'
          accept='image/png, image/jpeg'
          type='file'
          className='hidden'
          multiple={false}
        />
      </div>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        show={showCreateFolderDialog}
        setShow={setShowCreateFolderDialog}
        onCreateSuccess={(createdFolder) => {
          setSelectedFolderId(createdFolder.id);
        }}
      />
    </>
  );
}
