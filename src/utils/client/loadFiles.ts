import fg from 'fast-glob';
import path from 'path';

/**
 * Load files from a directory.
 * @param dirName The name of the directory to load files from.
 * @returns The list of file names.
 */
const loadFiles = async (dirName: string): Promise<string[]> => {
  const dirPath = path.join(__dirname, `src/${dirName}/**/*.js`);
  const fileNames: string[] = await fg(dirPath);
  return fileNames;
};

export default loadFiles;
