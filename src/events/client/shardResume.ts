import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.ShardResume,
  async execute(id: string, replayedEvents: number, client: ExtendedClient) {
    client.logger.info(
      `Shard resume: ${id} (${replayedEvents} events replayed)`
    );
  },
};
