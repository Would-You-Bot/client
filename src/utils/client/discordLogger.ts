import config from '@config';
import { IExtendedClient } from '@typings/core';
import { DiscordLogger } from 'discord-advanced';

import customQueue from './logValues';

let discordLogger: DiscordLogger | undefined;

/**
 * Initializes the discord logger.
 * @param client The discord client.
 */
export const initDiscordLogger = (client: IExtendedClient): void => {
  discordLogger = new DiscordLogger({
    client,
    channels: {
      info: config.env.INFO_CHANNEL,
      warn: config.env.WARN_CHANNEL,
      error: config.env.ERROR_CHANNEL,
      debug: config.env.DEBUG_CHANNEL,
    },
    customQueue,
  });

  discordLogger.send('info', 'Discord logger is ready!');
};

export default discordLogger;
