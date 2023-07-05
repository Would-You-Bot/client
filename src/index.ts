import app from './app';
import { ExtendedClient } from './client';

/**
 * The extended client class.
 */
export const client = new ExtendedClient();

(() => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');

  // If the client is on maintenance mode, log it
  if (typeof client.cluster.maintenance === 'string')
    client.logger.info(
      `Client on maintenance mode with ${client.cluster.maintenance}`
    );

  app(client);
})();
