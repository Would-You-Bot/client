import colors from 'colors';
import { Events } from 'discord.js';

import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  name: Events.ShardResume,
  /**
   * @param client
   * @param id
   */
  async execute(client: ExtendedClient, id: string) {
    client.logger.info(colors.green(`Shard ${id} resumed`));
  },
};

export default event;
