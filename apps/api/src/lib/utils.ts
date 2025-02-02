import { existsSync } from 'fs';
import { mkdir, unlink, writeFile } from 'fs/promises';

export const writingFile = async (
  path: string,
  fileName: string,
  data: Buffer | string
): Promise<string> => {
  // Create the directory if it doesn't exist
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }

  // Write the file
  await writeFile(`${path}/${fileName}`, data);

  return 'Success';
};

export const deleteFile = async (filePath: string): Promise<string> => {
  // Check if the file exists
  if (!existsSync(filePath)) {
    throw new Error(`File does not exist.`);
  }

  // Delete the file
  await unlink(filePath);

  return 'File deleted.';
};
