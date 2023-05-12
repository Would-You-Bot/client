import colors from 'colors';
import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

import { ExtendedClient } from 'src/client';

export default class ButtonHandler {
  client: ExtendedClient;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Load the buttons
   */
  async load() {
    for (const file of fs
      .readdirSync(path.join(__dirname, '..', 'buttons'))
      .filter((file) => file.endsWith('.ts'))) {
      const button = (await import(`@interactions/buttons/${file}`)).default;
      this.client.buttons.set(button.name, button);
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
  reload() {
    this.client.buttons = new Collection();
    this.load();
  }
}
