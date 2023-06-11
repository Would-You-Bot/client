import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.ShardResume,
}).execute((client, id: string, replayedEvents: number) => {
  client.logger.info(`Shard resume: ${id} (${replayedEvents} events replayed)`);
});
