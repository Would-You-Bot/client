import config from '@config';
import fs from 'fs';

export const ensureDirectories = async () => {
  const directories = [
    ['./static', './tmp'],
    ['./tmp/logs'],
    [`./tmp/logs/${config.logFolder}`],
  ];

  directories.forEach(async (level) => {
    level.map(async (dir) => {
      await fs.promises.mkdir(dir, { recursive: true });
    });
  });
};
