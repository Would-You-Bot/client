import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.ShardError,
}).execute((client, error: Error, shardId: string) => {
  client.logger.error(`Shard error: ${shardId}\nError: ${String(error)}`);
});
