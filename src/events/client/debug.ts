import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.Debug,
}).execute((client, info: string): void => {
  client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
});
