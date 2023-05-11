import colors from 'colors';

import { ExtendedClient } from './client';
import { ensureDirectories } from './utils';

export default async (client: ExtendedClient) => {
  // Run startup functions
  await ensureDirectories();

  // Authenticate the client
  const authStart = Date.now();
  await client.authenticate();
  const time = ((Date.now() - authStart) / 1000).toFixed(2);
  client.logger.info(
    `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
      `Client authenticated in ${time} seconds`
    )}`
  );
};
