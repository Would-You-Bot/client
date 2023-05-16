import colors from 'colors';

import ensureDirectories from '@utils/start/ensureDirectories';
import initializeHandlers from '@utils/start/initializeHandlers';
import { ExtendedClient } from './client';

/**
 * Main app file.
 * @param client The extended client.
 */
const app = async (client: ExtendedClient) => {
  // Run startup functions
  ensureDirectories();
  await initializeHandlers(client);

  // Authenticate the client
  const authStart = Date.now();
  await client.authenticate();
  const time = ((Date.now() - authStart) / 1000).toFixed(2);
  client.logger.info(colors.green(`Client authenticated in ${time} seconds`));

  const discordLog = await import('./utils/client/discordLog');
  discordLog.initDiscordLogs(client);
};

export default app;
