import { REST } from '@discordjs/rest';
import colors from 'colors';
import { Events, Routes } from 'discord.js';
import fs from 'fs';
import { AutoPoster } from 'topgg-autoposter';

import config from '@config';
import { CoreEvent } from '@typings/core';
import { ExtendedClient } from 'src/client';

const event: CoreEvent = {
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
        .filter((file) => file.endsWith('.ts'));

      const commands: any[] = [];

      for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      }

      const rest = new REST({
        version: '10',
      }).setToken(config.BOT_TOKEN);

      setTimeout(async () => {
        try {
          if (process.env.STATUS === 'PRODUCTION') {
            if (process.env.TOPGGTOKEN) {
              const ap = AutoPoster(`${process.env.TOPGGTOKEN}`, client);
            }
            // If the bot is in production mode it will load slash commands for all guilds
            await rest.put(
              Routes.applicationCommands(client.user?.id as string),
              {
                body: commands,
              }
            );
            console.log(
              `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
                'Successfully registered commands globally'
              )}`
            );
          } else {
            if (!process.env.GUILD_ID)
              return console.log(
                colors.red(
                  "Looks like your bot is not in production mode and you don't have a guild id set in .env"
                )
              );
            await rest.put(
              Routes.applicationGuildCommands(
                client.user?.id as string,
                process.env.GUILD_ID
              ),
              {
                body: commands,
              }
            );
            console.log(
              `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
                'Successfully registered commands locally'
              )}`
            );
          }
        } catch (err) {
          if (err) console.error(err);
        }
      }, 2500);
    }

    const setStatus = () => {
      client.user?.setPresence({
        activities: [{ name: `${process.env.BOTSTATUS || 'Would you?'}` }],
        status: 'dnd',
      });
    };

    setTimeout(() => setStatus(), 35 * 1000);
    setInterval(() => setStatus(), 60 * 60 * 1000); // Do this not so often because everytime you set the presence the bot won't receive any events for some seconds
  },
};

export default event;
