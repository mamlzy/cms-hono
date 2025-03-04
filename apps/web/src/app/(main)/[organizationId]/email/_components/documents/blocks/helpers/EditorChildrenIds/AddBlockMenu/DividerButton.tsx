import { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Props = {
  buttonElement: HTMLElement | null;
  onClick: () => void;
};
export function DividerButton({ buttonElement, onClick }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function listener({ clientX, clientY }: MouseEvent) {
      if (!buttonElement) {
        return;
      }

      const rect = buttonElement.getBoundingClientRect();
      const rectY = rect.y;
      const bottomX = rect.x;
      const topX = bottomX + rect.width;

      if (Math.abs(clientY - rectY) < 36) {
        if (bottomX < clientX && clientX < topX) {
          setVisible(true);
          return;
        }
      }
      setVisible(false);
    }
    window.addEventListener('mousemove', listener);
    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, [buttonElement, setVisible]);

  return (
    <DropdownMenuTrigger asChild>
      <Button
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
        className={cn(
          'absolute left-1/2 top-[-18px] z-10 size-8 rounded-full p-0 hover:bg-primary hover:brightness-90',
          visible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <PlusIcon className='' />
      </Button>
    </DropdownMenuTrigger>
  );
}
