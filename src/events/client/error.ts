import { Events } from 'discord.js';

import { CoreEventOptions } from '@typings/core';

export default <CoreEventOptions>{
  name: Events.Error,
  /**
   * Execute the event.
   * @param client The extended client.
   * @param error The error.
   */
  execute(client, error: Error): void {
    client.logger.error(error);
  },
};
