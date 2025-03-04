'use client';

/* eslint-disable consistent-return */
import { useMutation } from '@tanstack/react-query';
import { Reader, renderToStaticMarkup } from '@usewaypoint/email-builder';
import { MonitorIcon, SmartphoneIcon } from 'lucide-react';

import { hcs } from '@/lib/hono-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EditorBlock } from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import { ToggleInspectorPanelButton } from '../InspectorDrawer/ToggleInspectorPanelButton';
import { ToggleSidebarButton } from '../SamplesDrawer/ToggleSamplesPanelButton';
import { DownloadJson } from './DownloadJson';
import { HtmlPanel } from './HtmlPanel';
import { ImportJson } from './ImportJson';
import { JsonPanel } from './JsonPanel';
import { MainTabsGroup } from './MainTabsGroup';
import { ShareButton } from './ShareButton';

export function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const handleScreenSizeChange = (value: string) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize('desktop');
    }
  };

  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <div
            className={cn(
              'h-full',
              selectedScreenSize === 'mobile' &&
                'mx-auto my-8 w-[370px] shadow-md'
            )}
          >
            <div className='email-editor'>
              <EditorBlock id='root' />
            </div>
          </div>
        );
      case 'preview':
        return (
          <div
            className={cn(
              'h-full',
              selectedScreenSize === 'mobile' &&
                'mx-auto my-8 h-[800px] w-[370px] shadow-md'
            )}
          >
            <Reader document={document} rootBlockId='root' />
          </div>
        );
      case 'html':
        return <HtmlPanel />;
      case 'json':
        return <JsonPanel />;
      default:
    }
  };

  return (
    <div className=''>
      <div className='sticky top-0 z-10 flex h-[49px] flex-row items-center justify-between border-b bg-background px-px'>
        <ToggleSidebarButton />
        <div className='flex w-full flex-row items-center justify-between gap-[2px] px-[2px]'>
          <div className='flex flex-row gap-2'>
            <MainTabsGroup />
          </div>
          <div className='flex flex-row gap-2'>
            {/* Send Email button is disabled right now */}
            <SendEmail />
            <DownloadJson />
            <ImportJson />
            <ToggleGroup
              type='single'
              value={selectedScreenSize}
              onValueChange={handleScreenSizeChange}
            >
              <ToggleGroupItem value='desktop' aria-label='Toggle desktop'>
                <MonitorIcon className='size-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='mobile' aria-label='Toggle mobile'>
                <SmartphoneIcon className='size-4' />
              </ToggleGroupItem>
            </ToggleGroup>
            <ShareButton />
          </div>
        </div>
        <ToggleInspectorPanelButton />
      </div>

      <div className='relative h-[calc(100svh-137px)] min-w-[370px] overflow-y-auto'>
        {renderMainPanel()}
      </div>
    </div>
  );
}

function SendEmail() {
  const document = useDocument();

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const data = await hcs.api.test.email.$post({
        json: { html: renderToStaticMarkup(document, { rootBlockId: 'root' }) },
      });

      return data;
    },
  });

  return (
    <Button
      onClick={() => {
        sendEmailMutation.mutate();
      }}
      disabled={sendEmailMutation.isPending}
      className='sr-only'
    >
      {sendEmailMutation.isPending ? 'Sending...' : `Send`}
    </Button>
  );
}
