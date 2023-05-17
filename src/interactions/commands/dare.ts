import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('dare')
    .setDescription('Shows information about the bot.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Zeigt einige Informationen über den Bot.',
      'es-ES': 'Muestra información sobre el bot.',
    }),
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    // ! temp if statement to prevent eslint warning
    if (!interaction.guild || !client.user || !guildDb) return null;
  },
};

export default command;
