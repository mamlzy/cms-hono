import type { Dispatch, SetStateAction } from 'react';
import type { MediaGetAll } from '@/requests/media.request';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';

export type MediaTab = 'library' | 'upload';

export type MediaDialogProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  onSelectImage: (media: MediaGetAll) => void;
  defaultTabValue?: MediaTab;
  tabValue?: MediaTab;
  onTabValueChange?: Dispatch<SetStateAction<MediaTab>>;
  uploadDisabled?: boolean;
  selectedFolderId: null | string;
  setSelectedFolderId: Dispatch<SetStateAction<null | string>>;
};
