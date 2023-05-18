import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.Warn,
  async execute(info: string, client: ExtendedClient) {
    client.logger.warn(`Warning: ${info}`);
  },
};
