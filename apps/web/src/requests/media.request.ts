import type { DeleteMediaSchema, QsMediaSchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { http } from '@/lib/axios-client';
import { hcs } from '@/lib/hono-client';

const upload = async (payload: FormData) => {
  const res = await http.post('/media/upload', payload);

  return res.data;
};

const getAll = async (qs?: ToQueryString<QsMediaSchema>) => {
  const res = await hcs.api.media.$get({
    query: qs,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};
export type MediaGetAll = Awaited<ReturnType<typeof getAll>>[number];

const deleteById = async ({
  mediaId,
  ...payload
}: {
  mediaId: string;
} & DeleteMediaSchema) => {
  const res = await hcs.api.media[':mediaId'].$delete({
    param: {
      mediaId,
    },
    json: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};

export const mediaRequest = {
  upload,
  getAll,
  deleteById,
};
