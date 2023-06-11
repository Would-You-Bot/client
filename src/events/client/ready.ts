import { Events } from 'discord.js';
import { AutoPoster } from 'topgg-autoposter';

import config from '@config';
import CoreEvent from '@utils/builders/CoreEvent';
import { registerCommands } from '@utils/start';

export default new CoreEvent({
  once: true,
  name: Events.ClientReady,
}).execute(async (client) => {
  if (!client.user?.id) return;

  client.user.setPresence({
    activities: [{ name: 'Booting up...' }],
    status: 'idle',
  });

  if (config.isProduction() && config.env.TOPGG_TOKEN)
    AutoPoster(`${config.env.TOPGG_TOKEN}`, client);

  await registerCommands(client);

  /**
   * Sets the status of the bot.
   */
  client.user.setPresence({
    activities: [{ name: `${config.status || 'Would you?'}` }],
    status: 'dnd',
  });
});
