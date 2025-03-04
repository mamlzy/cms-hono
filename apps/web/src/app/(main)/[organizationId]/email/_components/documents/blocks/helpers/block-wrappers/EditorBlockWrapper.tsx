/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-cycle */
import { useState, type CSSProperties, type JSX } from 'react';

import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
  setSelectedBlockId,
  useSelectedBlockId,
} from '../../../editor/EditorContext';
import { TuneMenu } from './TuneMenu';

type TEditorBlockWrapperProps = {
  children: JSX.Element;
};

export function EditorBlockWrapper({ children }: TEditorBlockWrapperProps) {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = useState(false);
  const blockId = useCurrentBlockId();

  let outline: CSSProperties['outline'];
  if (selectedBlockId === blockId) {
    outline = '2px solid rgba(0,121,204, 1)';
  } else if (mouseInside) {
    outline = '2px solid rgba(0,121,204, 0.3)';
  }

  const renderMenu = () => {
    if (selectedBlockId !== blockId) {
      return null;
    }

    return <TuneMenu blockId={blockId} />;
  };

  return (
    <div
      onKeyDown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          setSelectedBlockId(blockId);
          ev.stopPropagation();
          ev.preventDefault();
        }
      }}
      onMouseEnter={(ev) => {
        setMouseInside(true);
        ev.stopPropagation();
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
      onClick={(ev) => {
        setSelectedBlockId(blockId);
        ev.stopPropagation();
        ev.preventDefault();
      }}
      className='relative max-w-full -outline-offset-1'
      style={{
        outline,
      }}
    >
      {renderMenu()}
      {children}
    </div>
  );
}
