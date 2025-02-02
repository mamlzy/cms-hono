import { http } from '@/lib/axios-client';
import { hcs } from '@/lib/hono-client';

const upload = async (payload: FormData) => {
  const res = await http.post('/media/upload', payload);

  return res.data;
};

const getAll = async () => {
  const res = await hcs.api.media.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const deleteById = async (mediaId: string) => {
  const res = await hcs.api.media[':mediaId'].$delete({
    param: {
      mediaId,
    },
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
