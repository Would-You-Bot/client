import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.ShardReconnecting,
}).execute((client, id: string) => {
  client.logger.info(`Shard reconnecting: ${id}`);
});
