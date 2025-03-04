import { useState } from 'react';
import {
  AvatarPropsDefaults,
  AvatarPropsSchema,
  type AvatarProps,
} from '@usewaypoint/block-avatar';
import { ProportionsIcon } from 'lucide-react';

import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { BaseSidebarPanel } from './helpers/BaseSidebarPanel';
import { RadioGroupInput } from './helpers/inputs/RadioGroupInput';
import { SliderInput } from './helpers/inputs/SliderInput';
import { TextInput } from './helpers/inputs/TextInput';
import { MultiStylePropertyPanel } from './helpers/style-inputs/MultiStylePropertyPanel';

type AvatarSidebarPanelProps = {
  data: AvatarProps;
  setData: (v: AvatarProps) => void;
};

export function AvatarSidebarPanel({ data, setData }: AvatarSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = AvatarPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const size = data.props?.size ?? AvatarPropsDefaults.size;
  const imageUrl = data.props?.imageUrl ?? AvatarPropsDefaults.imageUrl;
  const alt = data.props?.alt ?? AvatarPropsDefaults.alt;
  const shape = data.props?.shape ?? AvatarPropsDefaults.shape;

  return (
    <BaseSidebarPanel title='Avatar block'>
      <SliderInput
        label='Size'
        iconLabel={<ProportionsIcon />}
        units='px'
        step={3}
        min={32}
        max={256}
        defaultValue={size}
        onChange={(size) => {
          updateData({ ...data, props: { ...data.props, size } });
        }}
      />
      <RadioGroupInput
        label='Shape'
        defaultValue={shape}
        onChange={(shape) => {
          updateData({ ...data, props: { ...data.props, shape } });
        }}
      >
        <ToggleGroupItem value='circle' className='flex-1'>
          Circle
        </ToggleGroupItem>
        <ToggleGroupItem value='square' className='flex-1'>
          Square
        </ToggleGroupItem>
        <ToggleGroupItem value='rounded' className='flex-1'>
          Rounded
        </ToggleGroupItem>
      </RadioGroupInput>

      <TextInput
        label='Image URL'
        defaultValue={imageUrl}
        onChange={(imageUrl) => {
          updateData({ ...data, props: { ...data.props, imageUrl } });
        }}
      />
      <TextInput
        label='Alt text'
        defaultValue={alt}
        onChange={(alt) => {
          updateData({ ...data, props: { ...data.props, alt } });
        }}
      />

      <MultiStylePropertyPanel
        names={['textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
