import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LibraryTab } from './library-tab';
import type { MediaDialogProps, MediaTab } from './types';
import { UploadTab } from './upload-tab';

export function MediaDialog({
  open,
  onOpenChange,
  getRootProps,
  getInputProps,
  onSelectImage,
  defaultTabValue,
  tabValue,
  onTabValueChange,
  uploadDisabled,
  selectedFolderId,
  setSelectedFolderId,
}: MediaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='block h-svh w-full max-w-[90rem] overflow-y-auto md:h-[calc(100svh-100px)] md:w-[calc(100svw-100px)]'>
        <Tabs
          defaultValue={defaultTabValue}
          value={tabValue}
          onValueChange={
            onTabValueChange
              ? (value) => onTabValueChange(value as MediaTab)
              : undefined
          }
          className='h-full'
        >
          <div className='mb-6 flex flex-col items-center justify-between md:flex-row'>
            <DialogHeader className='mb-4 md:mb-0'>
              <DialogTitle className='text-2xl'>Upload Media</DialogTitle>
              <DialogDescription className='sr-only'>
                Upload Media
              </DialogDescription>
            </DialogHeader>

            <TabsList className='mb-4 h-12 md:mb-0'>
              <TabsTrigger
                value='library'
                className='px-4 py-2 text-base font-semibold'
              >
                Library
              </TabsTrigger>
              <TabsTrigger
                value='upload'
                className='px-4 py-2 text-base font-semibold'
              >
                Upload
              </TabsTrigger>
            </TabsList>

            {/* Dont remove this empty div! */}
            <div className='' />
          </div>
          {/* Library Tab */}
          <TabsContent value='library' className='h-[calc(100%-76px)] w-full'>
            <LibraryTab onSelectImage={onSelectImage} />
          </TabsContent>
          {/* Upload Tab */}
          <TabsContent value='upload' className='h-[calc(100%-190px)] w-full'>
            <UploadTab
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              uploadDisabled={uploadDisabled}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
