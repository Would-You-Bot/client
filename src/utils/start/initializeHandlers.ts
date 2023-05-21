import { ExtendedClient } from 'src/client';

/**
 * Loop through all the handlers and initialize them.
 * @param client The extended client.
 * @returns A logged error or nothing.
 */
const initializeHandlers = async (client: ExtendedClient): Promise<void> => {
  client.logger.info('Initializing handlers');
  const handlers = ['button', 'command', 'modal', 'event'];
  for (const handler of handlers) {
    const handlerStart = Date.now();

    // Import the handler
    const handlerFile = (await import(`../handlers/${handler}.handler.ts`)) as {
      default: ((extendedClient: ExtendedClient) => Promise<void>) | undefined;
    };

    // If the handler doesn't have a default export, log it
    if (!handlerFile.default) {
      client.logger.error(`Handler: ${handler} is missing a default export`);
      return;
    }

    // Initialize the handler
    await handlerFile.default(client);

    // Log the time it took to initialize the handler
    const time = ((Date.now() - handlerStart) / 1000).toFixed(2);
    client.logger.debug(`Handler: ${handler} initialized in ${time} seconds`);
  }
};

export default initializeHandlers;
