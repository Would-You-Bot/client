import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
  name: Events.Warn,
  /**
   * Executes the warn event.
   * @param client The extended client.
   * @param info The info.
   */
  execute(client, info: string) {
    client.logger.warn(`Warning: ${info}`);
  },
};
