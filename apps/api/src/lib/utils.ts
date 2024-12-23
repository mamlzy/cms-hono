import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

export const writingFile = async (
  path: string,
  fileName: string,
  data: Buffer | string
): Promise<string> => {
  // console.log('path =>', path);
  // console.log('existsSync(path) =>', existsSync(path));

  // Create the directory if it doesn't exist
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }

  // Write the file
  await writeFile(`${path}/${fileName}`, data);

  return 'Success';
};
