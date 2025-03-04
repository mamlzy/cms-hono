import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  setSidebarTab,
  useInspectorDrawerOpen,
  useSelectedSidebarTab,
} from '../../documents/editor/EditorContext';
import { ConfigurationPanel } from './ConfigurationPanel';
import { StylesPanel } from './StylesPanel';

export const INSPECTOR_DRAWER_WIDTH = 320;

export function InspectorDrawer() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  const selectedSidebarTab = useSelectedSidebarTab();

  return (
    <div
      className={cn(
        'h-[calc(100svh-88px)] overflow-y-auto border-l p-4',
        inspectorDrawerOpen ? 'block' : 'hidden'
      )}
      style={{ width: INSPECTOR_DRAWER_WIDTH }}
    >
      <Tabs value={selectedSidebarTab}>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='styles' onClick={() => setSidebarTab('styles')}>
            Styles
          </TabsTrigger>
          <TabsTrigger
            value='block-configuration'
            onClick={() => setSidebarTab('block-configuration')}
          >
            Inspect
          </TabsTrigger>
        </TabsList>
        <TabsContent value='styles'>
          <StylesPanel />
        </TabsContent>
        <TabsContent value='block-configuration'>
          <ConfigurationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
