import colors from 'colors';

import { initLogger } from '@utils/client';
import { initializeProcessErrorHandling } from '@utils/client/errorHandler';
import initializeVoteLog from '@utils/client/voteLog';
import connectToDatabase from '@utils/start/databaseConnection';
import ensureDirectories from '@utils/start/ensureDirectories';
import initializeHandlers from '@utils/start/initializeHandlers';
import { ExtendedClient } from './client';

/**
 * Main app file.
 * @param client The extended client.
 */
const app = async (client: ExtendedClient): Promise<void> => {
  // Run startup functions
  ensureDirectories();
  await initializeHandlers(client);
  initializeProcessErrorHandling(client);
  initializeVoteLog(client);

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
  const discordLog = await import('./utils/client/discordLog');
  discordLog.initDiscordLogs(client);
};

export default app;
