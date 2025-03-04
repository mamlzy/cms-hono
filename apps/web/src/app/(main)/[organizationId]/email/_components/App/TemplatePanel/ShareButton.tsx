import { Share2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDocument } from '../../documents/editor/EditorContext';

export function ShareButton() {
  const document = useDocument();

  const onClick = async () => {
    const c = encodeURIComponent(JSON.stringify(document));
    window.location.hash = `#code/${btoa(c)}`;
    toast.success(
      'The URL was updated. Copy it to share your current template.'
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline' size='icon' onClick={onClick}>
            <Share2Icon fontSize='small' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share current template</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
