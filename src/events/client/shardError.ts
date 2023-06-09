import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
  name: Events.ShardError,
  /**
   * Executes the shard error event.
   * @param client The extended client.
   * @param error The error.
   * @param shardId The shard id.
   */
  execute(client, error: Error, shardId: string) {
    client.logger.error(`Shard error: ${shardId}\nError: ${String(error)}`);
  },
};
