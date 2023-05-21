import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';

import config from '@config';
import { CoreButton } from '@typings/core';
import { GuildProfileDocument } from '@models/GuildProfile.model';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'welcomePing',
  description: 'Welcome User Pings',
  /**
   * @param interaction
   * @param client
   * @param guildDb
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient, guildDb: GuildProfileDocument) {
    if (!interaction.guild) return;

    const check = guildDb.welcomePing;

    const welcomes = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb.language, 'Settings.embed.welcomeTitle'))
      .setDescription(
        `${client.translation.get(guildDb.language, 'Settings.embed.welcome')}: ${
          guildDb.welcome ? config.emojis.check.full : config.emojis.close.full
        }\n${client.translation.get(guildDb.language, 'Settings.embed.welcomePing')}: ${
          check ? config.emojis.close.full : config.emojis.check.full
        }\n${client.translation.get(guildDb.language, 'Settings.embed.welcomeChannel')}: ${
          guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : config.emojis.close.full
        }`
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(guildDb.language, 'Settings.embed.footer'),
        iconURL: client.user?.avatarURL() || undefined,
      });

    const welcomeButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('welcome')
        .setLabel(client.translation.get(guildDb.language, 'Settings.button.welcome'))
        .setStyle(guildDb.welcome ? ButtonStyle.Success : ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('welcomeChannel')
        .setLabel(client.translation.get(guildDb.language, 'Settings.button.welcomeChannel'))
        .setStyle(guildDb.welcomeChannel ? ButtonStyle.Success : ButtonStyle.Secondary)
    );

    const welcomeButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('welcomePing')
        .setLabel(client.translation.get(guildDb.language, 'Settings.button.welcomePing'))
        .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success)
    );

    await client.database.updateGuild(interaction.guild.id, {
      welcomePing: !check,
    });

    return interaction.update({
      content: '',
      embeds: [welcomes],
      components: [welcomeButtons, welcomeButtons2],
    });
  },
};

export default button;
