import colors from 'colors';

import { initDiscordLogs } from '@utils/client';
import { ExtendedClient } from './client';
import { ensureDirectories } from './utils/start';

/**
 * The extended client class.
 */
export const client = new ExtendedClient();

(async () => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');
  if (client.cluster.maintenance)
    client.logger.info(
      `Client on maintenance mode with ${client.cluster.maintenance}`
    );

  // Run startup functions
  await ensureDirectories();

  // Authenticate the client
  const authStart = Date.now();
  await client.authenticate();
  const time = ((Date.now() - authStart) / 1000).toFixed(2);
  client.logger.info(colors.green(`Client authenticated in ${time} seconds`));

  initDiscordLogs();
})();
