import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { resetDocument } from '../../../documents/editor/EditorContext';
import { validateTextAreaValue } from './validateJsonStringValue';

type ImportJsonDialogProps = {
  onClose: () => void;
};
export function ImportJsonDialog({ onClose }: ImportJsonDialogProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (ev) => {
    const v = ev.currentTarget.value;
    setValue(v);
    const { error } = validateTextAreaValue(v);
    setError(error ?? null);
  };

  let errorAlert = null;
  if (error) {
    errorAlert = <p className='text-red-500'>{error}</p>;
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent overlayBackgroundReverse>
        <DialogHeader>
          <DialogTitle>Import JSON</DialogTitle>
          <DialogDescription>
            Copy and paste an EmailBuilder.js JSON (
            <Link
              href='https://gist.githubusercontent.com/jordanisip/efb61f56ba71bd36d3a9440122cb7f50/raw/30ea74a6ac7e52ebdc309bce07b71a9286ce2526/emailBuilderTemplate.json'
              target='_blank'
              className='underline underline-offset-4 hover:text-primary'
            >
              example
            </Link>
            ).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            console.log('submitted');
            const { error, data } = validateTextAreaValue(value);
            setError(error ?? null);
            if (!data) {
              return;
            }
            resetDocument(data);
            onClose();
          }}
        >
          {errorAlert}
          <Textarea value={value} onChange={handleChange} rows={10} />

          <DialogFooter className='mt-2'>
            <Button type='button' variant='ghost' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={error !== null}>
              Import
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
