import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [Error, string]> = {
  name: Events.ShardError,
  /**
   * Executes the shard error event.
   * @param client The extended client.
   * @param error The error.
   * @param shardId The shard id.
   */
  execute(client: ExtendedClient, error: Error, shardId: string) {
    client.logger.error(`Shard error: ${shardId}\nError: ${String(error)}`);
  },
};

export default event;
