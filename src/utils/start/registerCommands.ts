import colors from 'colors';
import { ApplicationCommand, REST, Routes } from 'discord.js';

import config from '@config';
import { IExtendedClient } from '@typings/core';

/**
 * Register commands.
 * @param client The extended client.
 */
export default async (client: IExtendedClient): Promise<void> => {
  if (client.cluster.id !== 0) return;
  if (!client.user?.id) return;

  const CLIENT_ID = client.user.id;

  const rest = new REST({
    version: '10',
  }).setToken(config.BOT_TOKEN);

  // Create a new array for all of the slash and context commands
  const commandJsonData = [
    ...Array.from(client.slashCommands.values()).map((command) => command.data),
    ...Array.from(client.contextMenuCommands.values()).map((command) => command.data),
  ];

  const regCmdStart = Date.now();

  // Register commands
  await (async () => {
    try {
      if (config.isProduction()) {
        // Register commands globally with production bot
        const data = (await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commandJsonData,
        })) as ApplicationCommand[];

        const time = ((Date.now() - regCmdStart) / 1000).toFixed(2);

        client.logger.info(
          colors.yellow(
            `Successfully reloaded ${data.length} application (/) commands globally (PRODUCTION) in ${colors.bold(
              colors.white(`${time}s`)
            )}.`
          )
        );
      } else if (config.isBeta()) {
        // Register commands globally with the beta bot
        const data = (await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commandJsonData,
        })) as ApplicationCommand[];

        const time = ((Date.now() - regCmdStart) / 1000).toFixed(2);

        client.logger.info(
          colors.yellow(
            `Successfully reloaded ${data.length} application (/) commands globally (BETA) in ${colors.bold(
              colors.white(`${time}s`)
            )}.`
          )
        );
      } else {
        // Register commands for test guild with beta bot
        const data = (await rest.put(Routes.applicationGuildCommands(CLIENT_ID, `${config.env.DEV_GUILD}`), {
          body: commandJsonData,
        })) as ApplicationCommand[];

        const time = ((Date.now() - regCmdStart) / 1000).toFixed(2);

        client.logger.info(
          colors.yellow(
            `Successfully reloaded ${data.length} application (/) commands in testing guild (DEV) in ${colors.bold(
              colors.white(`${time}s`)
            )}.`
          )
        );
      }
    } catch (error) {
      client.logger.error('Failed to register commands');
      if (error) client.logger.error(error);
    }
  })();
};
