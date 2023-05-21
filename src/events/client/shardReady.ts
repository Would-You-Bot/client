import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [string, Set<string>]> = {
  name: Events.ShardReady,
  /**
   * Executes the shard ready event.
   * @param client The extended client.
   * @param id The shard id.
   * @param unavailableGuilds The unavailable guilds.
   */
  execute(client: ExtendedClient, id: string, unavailableGuilds: Set<string>) {
    client.logger.info(`Shard ready: ${id}`);
    client.logger.info(`Shards unavailable: ${unavailableGuilds.size}`);
  },
};

export default event;
