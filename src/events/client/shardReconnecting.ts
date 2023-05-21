import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [string]> = {
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

export default event;
