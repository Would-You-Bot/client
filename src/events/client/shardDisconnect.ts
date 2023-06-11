import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.ShardDisconnect,
}).execute((client, event: CloseEvent, id: number): void => {
  client.logger.info(
    `Shard disconnected: ${id}\nReason: ${event.reason}\nCode: ${
      event.code
    }\n:Was Clean: ${event.wasClean ? 'true' : 'false'}`
  );
});
