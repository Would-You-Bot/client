import { Events } from 'discord.js';
import { AutoPoster } from 'topgg-autoposter';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { registerCommands } from '@utils/start';

export default <CoreEvent>{
  once: true,
  name: Events.ClientReady,
  /**
   * Executes the event.
   * @param client The extended client.
   * @returns A promise.
   */
  async execute(client) {
    if (!client.user?.id) return;

    client.user.setPresence({
      activities: [{ name: 'Booting up...' }],
      status: 'idle',
    });

    if (config.isProduction() && config.env.TOPGG_TOKEN) AutoPoster(`${config.env.TOPGG_TOKEN}`, client);

    await registerCommands(client);

    /**
     * Sets the status of the bot.
     */
    client.user.setPresence({
      activities: [{ name: `${config.status || 'Would you?'}` }],
      status: 'dnd',
    });
  },
};
