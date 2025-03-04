import { useState } from 'react';
import { UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ImportJsonDialog } from './ImportJsonDialog';

export function ImportJson() {
  const [open, setOpen] = useState(false);

  let dialog = null;
  if (open) {
    dialog = <ImportJsonDialog onClose={() => setOpen(false)} />;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='outline' size='icon' onClick={() => setOpen(true)}>
              <UploadIcon fontSize='small' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import JSON</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {dialog}
    </>
  );
}
