import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
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
