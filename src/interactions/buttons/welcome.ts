import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'welcome',
  description: 'Toggle Welcome Message',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guild) return;

    const check = guildDb.welcome;

    const welcomes = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, 'Settings.embed.welcomeTitle')
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcome'
        )}: ${
          check ? config.emojis.close.full : config.emojis.check.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcomePing'
        )}: ${
          guildDb.welcomePing
            ? config.emojis.check.full
            : config.emojis.close.full
        }\n${client.translation.get(
          guildDb?.language,
          'Settings.embed.welcomeChannel'
        )}: ${
          guildDb.welcomeChannel
            ? `<#${guildDb.welcomeChannel}>`
            : config.emojis.close.full
        }`
      )
      .setColor(config.colors.primary)
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          'Settings.embed.footer'
        ),
        iconURL: client.user?.avatarURL() || undefined,
      });

    const welcomeButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('welcome')
        .setLabel(
          client.translation.get(guildDb?.language, 'Settings.button.welcome')
        )
        .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('welcomeChannel')
        .setLabel(
          client.translation.get(
            guildDb?.language,
            'Settings.button.welcomeChannel'
          )
        )
        .setStyle(
          guildDb.welcomeChannel ? ButtonStyle.Success : ButtonStyle.Secondary
        )
    );

    const welcomeButtons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('welcomePing')
        .setLabel(
          client.translation.get(
            guildDb?.language,
            'Settings.button.welcomePing'
          )
        )
        .setStyle(
          guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary
        )
    );

    await client.database.updateGuild(interaction.guild.id, {
      welcome: !check,
    });

    return interaction.update({
      content: '',
      embeds: [welcomes],
      components: [welcomeButtons, welcomeButtons2],
    });
  },
};

export default button;
