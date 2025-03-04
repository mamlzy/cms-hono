'use client';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { useDocument } from '../../../documents/editor/EditorContext';
import { html, json } from './highlighters';

type TextEditorPanelProps = {
  type: 'json' | 'html' | 'javascript';
};
export function HighlightedCodePanel({ type }: TextEditorPanelProps) {
  const { theme } = useTheme();
  const document = useDocument();

  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    switch (type) {
      case 'html':
        html(document, theme!).then(setCode);
        return;
      case 'json':
        json(document, theme!).then(setCode);
        break;
      default:
    }
  }, [setCode, document, type, theme]);

  if (code === null) {
    return null;
  }

  return (
    <div className='w-full overflow-auto'>
      <pre
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: code,
        }}
        onClick={(ev) => {
          const s = window.getSelection();
          if (s === null) {
            return;
          }
          s.selectAllChildren(ev.currentTarget);
        }}
        className='m-0 max-w-full overflow-auto whitespace-pre-wrap break-words text-sm [&>*]:rounded-xl [&>*]:p-2'
      />
    </div>
  );
}
