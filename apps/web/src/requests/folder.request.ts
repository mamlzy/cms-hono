import type { CreateFolderSchema, QsFolderSchema } from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { hcs } from '@/lib/hono-client';

const create = async (folder: CreateFolderSchema) => {
  const res = await hcs.api.folders.$post({
    json: folder,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async (qs?: ToQueryString<QsFolderSchema>) => {
  const res = await hcs.api.folders.$get({
    query: qs,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};

const getById = async (folderId: string) => {
  const res = await hcs.api.folders.id[':folderId'].$get({
    param: {
      folderId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};

export const folderRequest = {
  create,
  getAll,
  getById,
};
