import fs from 'fs/promises';

/**
 * Manually import the language JSON files and create question pack documents in the database.
 */

export default async () => {
  const json = await fs.readFile(`./src/constants/languages/${lang}.json`, 'utf-8');
  const data = JSON.parse(json);
};

/* 
What would you do
Would you rather
Never have I ever
*/
