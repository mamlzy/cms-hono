import { useState } from 'react';
import { ImagePropsSchema, type ImageProps } from '@usewaypoint/block-image';
import {
  AlignCenterHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartVerticalIcon,
} from 'lucide-react';

import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { BaseSidebarPanel } from './helpers/BaseSidebarPanel';
import { RadioGroupInput } from './helpers/inputs/RadioGroupInput';
import { TextDimensionInput } from './helpers/inputs/TextDimensionInput';
import { TextInput } from './helpers/inputs/TextInput';
import { MultiStylePropertyPanel } from './helpers/style-inputs/MultiStylePropertyPanel';

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};
export function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title='Image block'>
      <TextInput
        label='Source URL'
        defaultValue={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />

      <TextInput
        label='Alt text'
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) =>
          updateData({ ...data, props: { ...data.props, alt } })
        }
      />
      <TextInput
        label='Click through URL'
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <div className='flex gap-2'>
        <TextDimensionInput
          label='Width'
          defaultValue={data.props?.width}
          onChange={(width) =>
            updateData({ ...data, props: { ...data.props, width } })
          }
        />
        <TextDimensionInput
          label='Height'
          defaultValue={data.props?.height}
          onChange={(height) =>
            updateData({ ...data, props: { ...data.props, height } })
          }
        />
      </div>

      <RadioGroupInput
        label='Alignment'
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) =>
          updateData({ ...data, props: { ...data.props, contentAlignment } })
        }
      >
        <ToggleGroupItem value='top' className='flex-1'>
          <AlignStartVerticalIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value='middle' className='flex-1'>
          <AlignCenterHorizontalIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value='bottom' className='flex-1'>
          <AlignEndVerticalIcon />
        </ToggleGroupItem>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
