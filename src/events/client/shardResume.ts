import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
  name: Events.ShardResume,
  /**
   * Executes the shard resume event.
   * @param client The extended client.
   * @param id The shard id.
   * @param replayedEvents The number of replayed events.
   */
  execute(client, id: string, replayedEvents: number) {
    client.logger.info(`Shard resume: ${id} (${replayedEvents} events replayed)`);
  },
};
