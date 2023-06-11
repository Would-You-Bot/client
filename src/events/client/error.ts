import { Events } from 'discord.js';

import CoreEvent from '@utils/builders/CoreEvent';

export default new CoreEvent({
  name: Events.Error,
}).execute((client, error: Error): void => {
  client.logger.error(error);
});
