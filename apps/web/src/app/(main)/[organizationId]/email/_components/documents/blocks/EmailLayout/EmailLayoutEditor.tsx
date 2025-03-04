/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-cycle */
import React from 'react';

import { useCurrentBlockId } from '../../editor/EditorBlock';
import {
  setDocument,
  setSelectedBlockId,
  useDocument,
} from '../../editor/EditorContext';
import { EditorChildrenIds } from '../helpers/EditorChildrenIds';
import { type EmailLayoutProps } from './EmailLayoutPropsSchema';

function getFontFamily(fontFamily: EmailLayoutProps['fontFamily']) {
  const MODERN_SANS =
    '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';

  switch (fontFamily) {
    case 'MODERN_SANS':
      return MODERN_SANS;
    case 'BOOK_SANS':
      return 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif';
    case 'ORGANIC_SANS':
      return 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif';
    case 'GEOMETRIC_SANS':
      return 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif';
    case 'HEAVY_SANS':
      return 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';
    case 'ROUNDED_SANS':
      return 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif';
    case 'MODERN_SERIF':
      return 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif';
    case 'BOOK_SERIF':
      return '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif';
    case 'MONOSPACE':
      return '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace';
    default:
      return MODERN_SANS;
  }
}

export function EmailLayoutEditor({
  childrenIds = [],
  backdropColor,
  textColor,
  fontFamily,
  canvasColor,
  borderRadius,
  borderColor,
}: EmailLayoutProps) {
  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  return (
    <div
      onClick={() => {
        setSelectedBlockId(null);
      }}
      style={{
        backgroundColor: backdropColor ?? '#F5F5F5',
        color: textColor ?? '#262626',
        fontFamily: getFontFamily(fontFamily),
        fontSize: '16px',
        fontWeight: '400',
        letterSpacing: '0.15008px',
        lineHeight: '1.5',
        margin: '0',
        padding: '32px 0',
        width: '100%',
        minHeight: '100%',
      }}
    >
      <table
        align='center'
        width='100%'
        style={{
          margin: '0 auto',
          maxWidth: '600px',
          backgroundColor: canvasColor ?? '#FFFFFF',
          borderRadius: borderRadius ?? undefined,
          border: (() => {
            const v = borderColor;
            if (!v) {
              return undefined;
            }
            return `1px solid ${v}`;
          })(),
        }}
        role='presentation'
        cellSpacing='0'
        cellPadding='0'
        border={0}
      >
        <tbody>
          <tr style={{ width: '100%' }}>
            <td>
              <EditorChildrenIds
                childrenIds={childrenIds}
                onChange={({ block, blockId, childrenIds }) => {
                  setDocument({
                    [blockId]: block,
                    [currentBlockId]: {
                      type: 'EmailLayout',
                      data: {
                        ...document[currentBlockId].data,
                        childrenIds,
                      },
                    },
                  });
                  setSelectedBlockId(blockId);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
