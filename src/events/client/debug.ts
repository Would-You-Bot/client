import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.Debug,
}).execute((client, info: string): void => {
  // Ignore token info
  if (info.includes('token')) return;
  // Ignore heartbeat info
  if (info.includes('Heartbeat')) return;
  // Log debug info
  client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
});
