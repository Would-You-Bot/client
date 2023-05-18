/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExtendedClient } from 'src/client';

/**
 * Initialize error handling for the client that deals with unhandled rejections and uncaught exceptions.
 * @param client The client.
 */
export const initializeErrorHandling = (client: ExtendedClient) => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    client.logger.error(`${String(reason)} ${JSON.stringify(promise)}`);
  });

  process.on('uncaughtException', (error: any, origin: string) => {
    client.logger.error(`${String(error)} ${origin}`);
  });

  process.on('uncaughtExceptionMonitor', (error: any, origin: string) => {
    client.logger.error(`${String(error)} ${origin}`);
  });
};
