const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
require('dotenv').config();
const { ChalkAdvanced } = require('chalk-advanced');
const { AutoPoster } = require('topgg-autoposter');
const { FetchWebsite } = require('../util/fetchWebsite');

module.exports = async (client) => {
  client.user.setPresence({
    activities: [{ name: 'Booting up...' }],
    status: 'idle',
  });

  const ap = AutoPoster(`${process.env.TOPGGTOKEN}`, client);

  ap.on('posted', () => {
    console.log(
      `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
        '>',
      )} ${ChalkAdvanced.green(
        'Stats pushed to https://top.gg/bot/981649513427111957',
      )}`,
    );
  });

  const commandFiles = readdirSync('./src/commands/').filter((file) => file.endsWith('.js'));

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const CLIENT_ID = client.user.id;

  const rest = new REST({
    version: '10',
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.STATUS === 'PRODUCTION') {
        // If the bot is in production mode it will load slash commands for all guilds
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commands,
        });
        console.log(
          `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
            '>',
          )} ${ChalkAdvanced.green(
            'Successfully registered commands globally',
          )}`,
        );
        FetchWebsite(client);
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
          {
            body: commands,
          },
        );

        console.log(
          `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
            '>',
          )} ${ChalkAdvanced.green('Successfully registered commands locally')}`,
        );
        // FetchWebsite(client)
      }
    } catch (err) {
      if (err) console.error(err);
    }
  })();
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: `${process.env.STATUSBOT}` }],
      status: 'dnd',
    });
  }, 15000);
};
