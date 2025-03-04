import { ChevronFirstIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  toggleInspectorDrawerOpen,
  useInspectorDrawerOpen,
} from '../../documents/editor/EditorContext';

export function ToggleInspectorPanelButton() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  return (
    <Button variant='outline' size='icon' onClick={toggleInspectorDrawerOpen}>
      <ChevronFirstIcon
        className={cn(inspectorDrawerOpen ? 'rotate-180' : 'rotate-0')}
      />
    </Button>
  );
}
