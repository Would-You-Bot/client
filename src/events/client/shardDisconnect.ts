import { CoreEvent } from '@typings/core';
import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [CloseEvent, number]> = {
  name: Events.ShardDisconnect,
  /**
   * Executes the shard disconnect event.
   * @param client The extended client.
   * @param event The close event.
   * @param id The shard id.
   */
  execute(client: ExtendedClient, event: CloseEvent, id: number): void {
    client.logger.info(
      `Shard disconnected: ${id}\nReason: ${event.reason}\nCode: ${event.code}\n:Was Clean: ${
        event.wasClean ? 'true' : 'false'
      }`
    );
  },
};

export default event;
