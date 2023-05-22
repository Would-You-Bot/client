import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
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
