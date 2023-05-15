import { REST } from '@discordjs/rest';
import colors from 'colors';
import { Events, Routes } from 'discord.js';
import fs from 'fs';
import { AutoPoster } from 'topgg-autoposter';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
  once: true,
  name: Events.ClientReady,
  async execute(client: ExtendedClient) {
    if (!client.user?.id) return;

    client.user.setPresence({
      activities: [{ name: 'Booting up...' }],
      status: 'idle',
    });

    if (client.cluster.id === 0) {
      const commandFiles = fs
        .readdirSync('./src/interactions/commands/')
        .filter((file) => file.endsWith('.js'));

      const commands: any[] = [];

      for (const file of commandFiles) {
        const command = (await import(`../interactions/commands/${file}`))
          .default;
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      }

      const rest = new REST({
        version: '10',
      }).setToken(config.BOT_TOKEN);

      setTimeout(async () => {
        try {
          if (config.isProduction()) {
            if (config.env.TOPGG_TOKEN)
              AutoPoster(`${config.env.TOPGG_TOKEN}`, client);

            // If the bot is in production mode it will load slash commands for all guilds
            await rest.put(
              Routes.applicationCommands(client.user?.id as string),
              {
                body: commands,
              }
            );
            client.logger.info(
              colors.green('Successfully registered commands globally')
            );
          } else {
            if (!config.env.LOG_GUILD)
              return client.logger.info(
                colors.red(
                  "Looks like your bot is not in production mode and you don't have a guild id set in .env"
                )
              );
            await rest.put(
              Routes.applicationGuildCommands(
                client.user?.id as string,
                config.env.LOG_GUILD
              ),
              {
                body: commands,
              }
            );
            client.logger.info(
              colors.green('Successfully registered commands locally')
            );
          }
        } catch (err) {
          if (err) client.logger.error(err);
        }
      }, 2500);
    }

    const setStatus = () => {
      client.user?.setPresence({
        activities: [{ name: `${config.status || 'Would you?'}` }],
        status: 'dnd',
      });
    };

    setTimeout(() => setStatus(), 35 * 1000);
    setInterval(() => setStatus(), 60 * 60 * 1000); // Do this not so often because everytime you set the presence the bot won't receive any events for some seconds
  },
};

export default event;
