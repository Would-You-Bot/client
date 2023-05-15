import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Displays the clients ping')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Zeigt den Ping des Clients an',
      'es-ES': 'Muestra el ping del cliente',
    }),
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const pingembed = new EmbedBuilder()

      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(guildDb?.language, 'Ping.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, 'Ping.embed.title'))
      .addFields(
        {
          name: client.translation.get(guildDb?.language, 'Ping.embed.client'),
          value: `> **${Math.abs(
            Date.now() - interaction.createdTimestamp
          )}**ms`,
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, 'Ping.embed.api'),
          value: `> **${Math.round(client.ws.ping)}**ms`,
          inline: false,
        }
      );
    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(
          client.translation.get(guildDb?.language, 'Ping.button.title')
        )
        .setStyle(ButtonStyle.Link)
        .setEmoji('💻')
        .setURL('https://discordstatus.com/')
    );
    await interaction
      .reply({
        embeds: [pingembed],
        components: [button],
        ephemeral: true,
      })
      .catch(client.logger.error);
  },
};

export default command;
