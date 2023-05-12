import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

import config from '@config';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const cat = fs
  .readdirSync(`./src/interactions/commands/`)
  .filter((d) => d.endsWith('.ts'));

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads slash commands.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Lädt slash commands neu.',
      'es-ES': 'Recargar los slash commands.',
    })
    .addStringOption((option) =>
      option
        .setName('options')
        .setDescription('Choose which command you want to reload.')
        .setRequired(true)
    ),
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient
  ) {
    await interaction.deferReply({ ephemeral: true });

    if (!config.developers.find((e) => e === interaction.user.id))
      return interaction.editReply({
        content:
          'Only Would You develpers have access to this command! | Nur Would You Entwickler haben Zugriff auf diesen Befehl!',
      });

    const cmd = interaction.options.getString('options');

    if (!cmd) return;

    if (!cat.find((e) => e.replace('.ts', '') === cmd.toLowerCase()))
      return interaction.editReply({
        content: 'You must provide a valid command to reload it!',
      });

    try {
      delete require.cache[require.resolve(`./${cmd}.ts`)];
      const pull = require(`./${cmd}.ts`);
      client.commands.delete(cmd);
      client.commands.set(cmd, pull);
      return interaction.editReply({
        content: `Successfully reloaded command \`${cmd}\`!`,
      });
    } catch (e: any) {
      return interaction.editReply({
        content: `Errored reloading command: \`${cmd}\`!\nError: ${e.message}`,
      });
    }
  },
};

export default command;
