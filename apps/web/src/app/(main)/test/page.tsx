// import { assertAuthenticated } from '@/lib/session';

// export default async function Page() {
//   const user = await assertAuthenticated();

//   console.log('user =>', user);

//   return <div>Test</div>;
// }

'use client';

import Link from 'next/link';

import { useSession } from '@/hooks/use-session';

export default function Page() {
  const session = useSession();

  return (
    <div>
      <p>Name: {session.user?.name}</p>
      <Link href='/test/2'>Test 2 Page</Link>
    </div>
  );
}
