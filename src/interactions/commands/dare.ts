import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { version } from 'package.json';

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
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {},
};

export default command;
