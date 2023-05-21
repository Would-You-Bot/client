import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent<ExtendedClient, [Error]> = {
  name: Events.Error,
  /**
   * Execute the event.
   * @param client The extended client.
   * @param error The error.
   */
  execute(client: ExtendedClient, error: Error): void {
    client.logger.error(error);
  },
};

export default event;
