import fg from 'fast-glob';

/**
 * Load files from a directory.
 * @param dirName The name of the directory to load files from.
 * @returns The list of file names.
 */
const loadFiles = async (dirName: string) => {
  const fileNames: string[] = await fg(`src/${dirName}/**/*.ts`);
  return fileNames;
};

export default loadFiles;
