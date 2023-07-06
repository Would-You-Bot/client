import { Events } from 'discord.js';
import { AutoPoster } from 'topgg-autoposter';

import config from '@config';
import CoreEvent from '@utils/builders/CoreEvent';
import { logger } from '@utils/client';
import { registerCommands } from '@utils/start';

export default new CoreEvent({
  once: true,
  name: Events.ClientReady,
}).execute(async (client) => {
  logger.info(`Logged in as ${client.user?.username ?? 'Unknown'}`);

  if (!client.user?.id) return;

  const developers = [];
  for (const id of config.developers) {
    try {
      const devUser = await client.users.fetch(id);
      developers.push(devUser.username);
    } catch (error) {
      developers.push(`Error: ${id}`);
    }
  }
  client.setDevelopers(developers);

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
