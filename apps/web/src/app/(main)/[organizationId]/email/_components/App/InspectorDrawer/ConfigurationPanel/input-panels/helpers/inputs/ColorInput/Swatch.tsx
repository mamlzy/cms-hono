import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
  paletteColors: string[];
  value: string;
  onChange: (value: string) => void;
};

export function Swatch({ paletteColors, value, onChange }: Props) {
  const renderButton = (colorValue: string) => {
    return (
      <Button
        key={colorValue}
        onClick={() => onChange(colorValue)}
        className={cn(
          'size-6 min-w-6 border p-0',
          value === colorValue && 'border-black'
        )}
        style={{
          backgroundColor: colorValue,
        }}
      />
    );
  };
  return (
    <div className='grid w-full grid-cols-6 gap-px'>
      {paletteColors.map((c) => renderButton(c))}
    </div>
  );
}
