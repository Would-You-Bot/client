import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

export default {
  name: Events.ShardDisconnect,
  async execute(event: CloseEvent, id: number, client: ExtendedClient) {
    client.logger.info(
      `Shard disconnected: ${id}\nReason: ${event.reason}\nCode: ${event.code}\n:Was Clean: ${event.wasClean}`
    );
  },
};
