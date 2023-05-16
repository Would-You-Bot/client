import { ExtendedClient } from 'src/client';

/**
 * Loop through all the handlers and initialize them.
 * @param client The extended client.
 * @returns A logged error or nothing.
 */
const initializeHandlers = async (client: ExtendedClient) => {
  client.logger.info('Initializing handlers');
  const handlers = ['button', 'command'];
  for (const handler of handlers) {
    const handlerStart = Date.now();
    const handlerFile = (await import(`../handlers/${handler}.handler.ts`)) as {
      default: ((extendedClient: ExtendedClient) => Promise<void>) | undefined;
    };

    if (!handlerFile.default)
      return client.logger.error(
        `Handler: ${handler} is missing a default export`
      );

    await handlerFile.default(client);
    const time = ((Date.now() - handlerStart) / 1000).toFixed(2);
    client.logger.debug(`Handler: ${handler} initialized in ${time} seconds`);
  }
};

export default initializeHandlers;
