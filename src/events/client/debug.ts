import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [string]> = {
  name: Events.Debug,
  /**
   * Execute the debug event.
   * @param client The extended client.
   * @param info The debug information.
   */
  execute(client: ExtendedClient, info: string): void {
    client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
  },
};

export default event;
