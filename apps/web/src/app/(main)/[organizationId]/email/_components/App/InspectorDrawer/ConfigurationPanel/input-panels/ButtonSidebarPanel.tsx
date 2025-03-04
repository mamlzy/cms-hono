import { useState } from 'react';
import {
  ButtonPropsDefaults,
  ButtonPropsSchema,
  type ButtonProps,
} from '@usewaypoint/block-button';

import { ToggleGroupItem } from '@/components/ui/toggle-group';
import { BaseSidebarPanel } from './helpers/BaseSidebarPanel';
import { ColorInput } from './helpers/inputs/ColorInput';
import { RadioGroupInput } from './helpers/inputs/RadioGroupInput';
import { TextInput } from './helpers/inputs/TextInput';
import { MultiStylePropertyPanel } from './helpers/style-inputs/MultiStylePropertyPanel';

type ButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};
export function ButtonSidebarPanel({ data, setData }: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? ButtonPropsDefaults.text;
  const url = data.props?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const buttonStyle =
    data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle;
  const buttonTextColor =
    data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor =
    data.props?.buttonBackgroundColor ??
    ButtonPropsDefaults.buttonBackgroundColor;

  return (
    <BaseSidebarPanel title='Button block'>
      <TextInput
        label='Text'
        defaultValue={text}
        onChange={(text) =>
          updateData({ ...data, props: { ...data.props, text } })
        }
      />
      <TextInput
        label='Url'
        defaultValue={url}
        onChange={(url) =>
          updateData({ ...data, props: { ...data.props, url } })
        }
      />
      <RadioGroupInput
        label='Width'
        defaultValue={fullWidth ? 'FULL_WIDTH' : 'AUTO'}
        onChange={(v) =>
          updateData({
            ...data,
            props: { ...data.props, fullWidth: v === 'FULL_WIDTH' },
          })
        }
      >
        <ToggleGroupItem value='FULL_WIDTH' className='flex-1'>
          Full
        </ToggleGroupItem>
        <ToggleGroupItem value='AUTO' className='flex-1'>
          Auto
        </ToggleGroupItem>
      </RadioGroupInput>
      <RadioGroupInput
        label='Size'
        defaultValue={size}
        onChange={(size) =>
          updateData({ ...data, props: { ...data.props, size } })
        }
      >
        <ToggleGroupItem value='x-small' className='flex-1'>
          Xs
        </ToggleGroupItem>
        <ToggleGroupItem value='small' className='flex-1'>
          Sm
        </ToggleGroupItem>
        <ToggleGroupItem value='medium' className='flex-1'>
          Md
        </ToggleGroupItem>
        <ToggleGroupItem value='large' className='flex-1'>
          Lg
        </ToggleGroupItem>
      </RadioGroupInput>
      <RadioGroupInput
        label='Style'
        defaultValue={buttonStyle}
        onChange={(buttonStyle) =>
          updateData({ ...data, props: { ...data.props, buttonStyle } })
        }
      >
        <ToggleGroupItem value='rectangle' className='flex-1'>
          Rectangle
        </ToggleGroupItem>
        <ToggleGroupItem value='rounded' className='flex-1'>
          Rounded
        </ToggleGroupItem>
        <ToggleGroupItem value='pill' className='flex-1'>
          Pill
        </ToggleGroupItem>
      </RadioGroupInput>
      <ColorInput
        label='Text color'
        defaultValue={buttonTextColor}
        onChange={(buttonTextColor) =>
          updateData({ ...data, props: { ...data.props, buttonTextColor } })
        }
      />
      <ColorInput
        label='Button color'
        defaultValue={buttonBackgroundColor}
        onChange={(buttonBackgroundColor) =>
          updateData({
            ...data,
            props: { ...data.props, buttonBackgroundColor },
          })
        }
      />
      <MultiStylePropertyPanel
        names={[
          'backgroundColor',
          'fontFamily',
          'fontSize',
          'fontWeight',
          'textAlign',
          'padding',
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
