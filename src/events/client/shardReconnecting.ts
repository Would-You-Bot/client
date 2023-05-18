import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.ShardReconnecting,
  async execute(id: string, client: ExtendedClient) {
    client.logger.info(`Shard reconnecting: ${id}`);
  },
};
