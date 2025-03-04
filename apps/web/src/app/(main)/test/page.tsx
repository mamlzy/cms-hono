'use client';

import Link from 'next/link';
import { authClient } from '@repo/auth/client';

export default function Page() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <p>Name: {session?.user.name}</p>
      <Link href='/test/2'>Test 2 Page</Link>
    </div>
  );
}
