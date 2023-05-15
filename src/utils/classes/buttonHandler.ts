import colors from 'colors';
import { Collection } from 'discord.js';
import fs from 'fs';

import { ExtendedClient } from 'src/client';

export default class ButtonHandler {
  client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Load the buttons
   */
  async load(): Promise<void> {
    for (const fileName of fs
      .readdirSync('./src/interactions/buttons')
      .filter((name) => name.endsWith('.js'))) {
      this.client.logger.debug(`Importing button: ${fileName}`);

      const button = await import(`../../interactions/buttons/${fileName}`);

      this.client.buttons.set(button.default.name, button.default);
    }
    this.client.logger.info(
      `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
        'Successfully loaded buttons'
      )}`
    );
  }

  /**
   * Reload the buttons collection
   */
  reload(): void {
    this.client.buttons = new Collection();
    this.load();
  }
}
