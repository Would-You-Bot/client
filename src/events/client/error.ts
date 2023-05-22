import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
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
