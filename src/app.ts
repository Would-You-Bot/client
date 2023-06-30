import { ensureDirectories } from '@slekup/utils';
import colors from 'colors';

import config from '@config';
import { initLogger } from '@utils/client';
import { initializeProcessErrorHandling } from '@utils/client/errorHandler';
import connectToDatabase from '@utils/start/databaseConnection';
import initializeHandlers from '@utils/start/initializeHandlers';
import { ExtendedClient } from './client';

/**
 * Main app file.
 * @param client The extended client.
 */
const app = async (client: ExtendedClient): Promise<void> => {
  // Run startup functions
  ensureDirectories([
    ['./static', './tmp'],
    ['./tmp/logs'],
    [`./tmp/logs/${config.logFolder}`],
  ]);
  await initializeHandlers(client);
  initializeProcessErrorHandling(client);

  // Connect to database
  await connectToDatabase();

  // Sync database
  // Initialize translations

  // Authenticate the client
  const authStart = Date.now();
  await client.authenticate();
  const time = ((Date.now() - authStart) / 1000).toFixed(2);
  client.logger.info(colors.green(`Client authenticated in ${time} seconds`));

  // Initialize the logger by passing the cluster id
  initLogger(client.cluster.id);

  // Initialize discord logging (sends logs to discord channels)
  const { initDiscordLogger } = await import('./utils/client/discordLogger');
  initDiscordLogger(client);
};

export default app;
