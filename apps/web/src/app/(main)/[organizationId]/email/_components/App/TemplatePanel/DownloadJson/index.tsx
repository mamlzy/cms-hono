import { useMemo } from 'react';
import { DownloadIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDocument } from '../../../documents/editor/EditorContext';

export function DownloadJson() {
  const doc = useDocument();

  const href = useMemo(() => {
    return `data:text/plain,${encodeURIComponent(JSON.stringify(doc, null, '  '))}`;
  }, [doc]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            download='emailTemplate.json'
            className={cn(buttonVariants({ size: 'icon', variant: 'outline' }))}
            data-disable-nprogress
          >
            <DownloadIcon fontSize='small' />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download JSON file</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
