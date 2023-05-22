import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
  name: Events.Debug,
  /**
   * Execute the debug event.
   * @param client The extended client.
   * @param info The debug information.
   */
  execute(client, info: string): void {
    client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
  },
};
