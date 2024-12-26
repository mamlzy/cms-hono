'use client';

import { useEffect, useRef, useState } from 'react';
import { createId } from '@paralleldrive/cuid2';
import { useQuery } from '@tanstack/react-query';

import { hc } from '@/lib/hono-client';
import { Button } from '@/components/ui/button';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const files = inputRef.current?.files;
    if (!files || files.length === 0) {
      return;
    }

    console.log(inputRef.current?.files);
    const formData = new FormData();
    // formData.append('file', file);

    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response:', await res.json());
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await hc.api.users.$get();
      const data = await res.json();

      console.log('data =>', data);
    };

    getData();
  }, []);

  const [trigger, setTrigger] = useState<string | null>(null);

  const usersQuery = useQuery({
    enabled: !!trigger,
    queryKey: ['users'],
    queryFn: async () => {
      const res = await hc.api.users.$get();
      const data = await res.json();

      return data;
    },
  });

  return (
    <div className=''>
      <div className='mb-10'>
        <input ref={inputRef} type='file' name='file' id='' multiple />
        <button type='button' onClick={onSubmit}>
          Submit
        </button>
      </div>

      <Button
        onClick={() => {
          setTrigger(createId());
        }}
      >
        Fetch Users
      </Button>
      {usersQuery.isLoading && <li>Loading...</li>}
      {usersQuery.data &&
        usersQuery.data.data?.map((user) => (
          <ul key={user.id} className='mb-5'>
            <li key={user.id}>{user.name}</li>
            <li>{user.email}</li>
            <li>{user.createdAt}</li>
            <li>{user.updatedAt}</li>
            <li>{user.username}</li>
          </ul>
        ))}
    </div>
  );
}
