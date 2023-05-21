import { CoreEvent } from '@typings/core';
import { Events } from 'discord.js';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [string]> = {
  name: Events.Warn,
  /**
   * Executes the warn event.
   * @param client The extended client.
   * @param info The info.
   */
  execute(client: ExtendedClient, info: string) {
    client.logger.warn(`Warning: ${info}`);
  },
};

export default event;
