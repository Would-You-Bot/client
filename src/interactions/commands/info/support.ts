import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { CoreCommandOptions } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommandOptions = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Link to our support server')
    .setDMPermission(true)
    .setDescriptionLocalizations({
      'de': 'Link zu unserem Support Server',
      'es-ES': 'Link para nuestro servidor de soporte',
    }),
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    const supportembed = new EmbedBuilder()
      .setColor(config.colors.danger)
      .setTitle(client.translation.get(guildDb.language, 'Support.embed.title'))
      .setDescription(client.translation.get(guildDb.language, 'Support.embed.description'))
      .setFooter({
        text: client.translation.get(guildDb.language, 'Support.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp();

    const supportbutton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel('Support Server')
        .setStyle(ButtonStyle.Link)
        .setEmoji('💻')
        .setURL(config.links.support)
    );

    return interaction
      .reply({
        embeds: [supportembed],
        components: [supportbutton],
      })
      .catch(client.logger.error);
  },
};

export default command;
