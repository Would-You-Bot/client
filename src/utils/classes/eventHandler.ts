import fs from 'fs';

import { ExtendedClient } from 'src/client';

/**
 *
 */
export default class EventHandler {
  client: ExtendedClient;

  /**
   * @param client
   */
  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Load the buttons.
   */
  async load() {
    fs.readdir('./src/events/', (err, files) => {
      if (err) return this.client.logger.error(err);

      files.forEach(async (fileName) => {
        this.client.logger.debug(`Importing event: ${fileName}`);

        const event = (await import(`../../events/${fileName}`)).default;

        /**
         * @param args
         */
        const execute = (...args: any[]) => event.execute(...args, this.client);

        try {
          if (event.once) this.client.once(event.name, execute);
          else this.client.on(event.name, execute);
        } catch (error) {
          this.client.logger.error(error);
        }
      });
    });
  }

  /**
   * Reload the buttons.
   */
  reload() {
    this.client.removeAllListeners();
    this.load();
    // This needs to be started, since we removed all event listeners
    this.client.keepAlive.start();
  }
}
