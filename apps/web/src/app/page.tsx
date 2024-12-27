import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Page() {
  return (
    <div className='grid size-[100svh] place-items-center'>
      <Link
        href='/login'
        className={cn(buttonVariants({ variant: 'link' }), 'text-2xl')}
      >
        Login Page
      </Link>
    </div>
  );
}
