import { db, eq } from '@repo/db';
import { folderTable } from '@repo/db/schema';

export const getFolderById = async (id: string) => {
  const folder = await db.query.folderTable.findFirst({
    where: eq(folderTable.id, id),
  });

  return folder;
};
