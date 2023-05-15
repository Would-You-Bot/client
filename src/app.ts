import colors from 'colors';

import { ExtendedClient } from './client';
import { ensureDirectories } from './utils/start';

export const client = new ExtendedClient();

(async () => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');

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
})();

export default {};
