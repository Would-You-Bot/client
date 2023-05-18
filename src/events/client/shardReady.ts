import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.ShardReady,
  async execute(
    id: string,
    unavailableGuilds: Set<string>,
    client: ExtendedClient
  ) {
    client.logger.info(`Shard ready: ${id}`);
  },
};
