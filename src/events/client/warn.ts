import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
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
