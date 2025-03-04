'use client';

/* eslint-disable consistent-return */
import { cn } from '@/lib/utils';
import { InspectorDrawer } from './_components/App/InspectorDrawer';
import { TemplatePanel } from './_components/App/TemplatePanel';
import { useInspectorDrawerOpen } from './_components/documents/editor/EditorContext';

export default function Page() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  return (
    <div
      className={cn(
        'grid',
        inspectorDrawerOpen ? 'grid-cols-[1fr,320px]' : 'grid-cols-1'
      )}
    >
      <TemplatePanel />

      <InspectorDrawer />
    </div>
  );
}
