import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.Debug,
  async execute(info: string, client: ExtendedClient) {
    client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
  },
};
