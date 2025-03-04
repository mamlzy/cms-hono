import React from 'react';
import { BracesIcon, CodeIcon, EyeIcon, PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  setSelectedMainTab,
  useSelectedMainTab,
} from '../../documents/editor/EditorContext';

export function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();

  const handleChange = (_: unknown, v: unknown) => {
    switch (v) {
      case 'json':
      case 'preview':
      case 'editor':
      case 'html':
        setSelectedMainTab(v);
        return;
      default:
        setSelectedMainTab('editor');
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant={selectedMainTab === 'editor' ? 'default' : 'outline'}
        size='icon'
        onClick={() => handleChange(null, 'editor')}
      >
        <PencilIcon />
      </Button>
      <Button
        variant={selectedMainTab === 'preview' ? 'default' : 'outline'}
        size='icon'
        onClick={() => handleChange(null, 'preview')}
      >
        <EyeIcon />
      </Button>
      <Button
        variant={selectedMainTab === 'html' ? 'default' : 'outline'}
        size='icon'
        onClick={() => handleChange(null, 'html')}
      >
        <CodeIcon />
      </Button>
      <Button
        variant={selectedMainTab === 'json' ? 'default' : 'outline'}
        size='icon'
        onClick={() => handleChange(null, 'json')}
      >
        <BracesIcon />
      </Button>
    </div>
  );
}
