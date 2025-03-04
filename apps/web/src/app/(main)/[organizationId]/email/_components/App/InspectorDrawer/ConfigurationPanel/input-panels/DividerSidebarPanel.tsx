import { useState } from 'react';
import {
  DividerPropsDefaults,
  DividerPropsSchema,
  type DividerProps,
} from '@usewaypoint/block-divider';
import { MoveVerticalIcon } from 'lucide-react';

import { BaseSidebarPanel } from './helpers/BaseSidebarPanel';
import { ColorInput } from './helpers/inputs/ColorInput';
import { SliderInput } from './helpers/inputs/SliderInput';
import { MultiStylePropertyPanel } from './helpers/style-inputs/MultiStylePropertyPanel';

type DividerSidebarPanelProps = {
  data: DividerProps;
  setData: (v: DividerProps) => void;
};
export function DividerSidebarPanel({
  data,
  setData,
}: DividerSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = DividerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const lineColor = data.props?.lineColor ?? DividerPropsDefaults.lineColor;
  const lineHeight = data.props?.lineHeight ?? DividerPropsDefaults.lineHeight;

  return (
    <BaseSidebarPanel title='Divider block'>
      <ColorInput
        label='Color'
        defaultValue={lineColor}
        onChange={(lineColor) =>
          updateData({ ...data, props: { ...data.props, lineColor } })
        }
      />
      <SliderInput
        label='Height'
        iconLabel={<MoveVerticalIcon />}
        units='px'
        step={1}
        min={1}
        max={24}
        defaultValue={lineHeight}
        onChange={(lineHeight) =>
          updateData({ ...data, props: { ...data.props, lineHeight } })
        }
      />
      <MultiStylePropertyPanel
        names={['backgroundColor', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
