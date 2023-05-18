import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.ShardError,
  async execute(error: Error, shardId: string, client: ExtendedClient) {
    client.logger.error(`Shard error: ${shardId}\nError: ${error}`);
  },
};
