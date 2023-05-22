import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
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
