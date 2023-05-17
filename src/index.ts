import { ExtendedClient } from './client';

/**
 * The extended client class.
 */
export const client = new ExtendedClient();

await (async () => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');

  if (typeof client.cluster.maintenance === 'string')
    client.logger.info(`Client on maintenance mode with ${client.cluster.maintenance}`);

  const app = (await import('./app')) as {
    default: (clientParam: ExtendedClient) => Promise<void>;
  };
  app.default(client);
})();
