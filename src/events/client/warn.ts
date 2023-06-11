import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.Warn,
}).execute((client, info: string) => {
  client.logger.warn(`Warning: ${info}`);
});
