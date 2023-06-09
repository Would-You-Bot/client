import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';
import { ExtendedClient } from 'src/client';

export default <CoreEventOptions>{
  name: Events.ShardReconnecting,
  /**
   * Executes the shard reconnecting event.
   * @param client The extended client.
   * @param id The shard id.
   */
  execute(client: ExtendedClient, id: string) {
    client.logger.info(`Shard reconnecting: ${id}`);
  },
};
