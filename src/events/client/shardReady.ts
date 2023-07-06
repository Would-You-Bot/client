import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.ShardReady,
}).execute((client, id: string, unavailableGuilds?: Set<string>) => {
  client.logger.info(`Shard ready: ${id}`);
  if (unavailableGuilds?.size)
    client.logger.info(`Shards unavailable: ${unavailableGuilds.size}`);
});
