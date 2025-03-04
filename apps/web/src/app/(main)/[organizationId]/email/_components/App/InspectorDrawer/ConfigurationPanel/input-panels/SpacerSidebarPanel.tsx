import { useState } from 'react';
import {
  SpacerPropsDefaults,
  SpacerPropsSchema,
  type SpacerProps,
} from '@usewaypoint/block-spacer';
import { MoveVerticalIcon } from 'lucide-react';

import { BaseSidebarPanel } from './helpers/BaseSidebarPanel';
import { SliderInput } from './helpers/inputs/SliderInput';

type SpacerSidebarPanelProps = {
  data: SpacerProps;
  setData: (v: SpacerProps) => void;
};
export function SpacerSidebarPanel({ data, setData }: SpacerSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = SpacerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title='Spacer block'>
      <SliderInput
        label='Height'
        iconLabel={<MoveVerticalIcon />}
        units='px'
        step={4}
        min={4}
        max={128}
        defaultValue={data.props?.height ?? SpacerPropsDefaults.height}
        onChange={(height) =>
          updateData({ ...data, props: { ...data.props, height } })
        }
      />
    </BaseSidebarPanel>
  );
}
