import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
  name: Events.ShardReady,
  /**
   * Executes the shard ready event.
   * @param client The extended client.
   * @param id The shard id.
   * @param unavailableGuilds The unavailable guilds.
   */
  execute(client, id: string, unavailableGuilds: Set<string>) {
    client.logger.info(`Shard ready: ${id}`);
    client.logger.info(`Shards unavailable: ${unavailableGuilds.size}`);
  },
};
