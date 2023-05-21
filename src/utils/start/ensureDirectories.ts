import config from '@config';
import fs from 'fs';

/**
 * Ensure that all directories are created before starting the client.
 */
const ensureDirectories = () => {
  const directories = [
    ['./static', './tmp'],
    ['./tmp/logs'],
    [`./tmp/logs/${config.logFolder}`],
  ];

  directories.forEach((level) => {
    level.map(async (dir) => {
      await fs.promises.mkdir(dir, { recursive: true });
    });
  });
};

export default ensureDirectories;
