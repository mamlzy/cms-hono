'use client';

import { hc } from '@/lib/hono-client';
import { useEffect, useRef,  } from 'react';

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
      const res = await hc.api.users.$get()
      const data = await res.json()

      console.log("data =>", data)

    }

    getData();
  }, [])

  return (
    <div className=''>
      <input ref={inputRef} type='file' name='file' id='' multiple />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}
