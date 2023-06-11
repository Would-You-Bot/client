import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { IExtendedClient } from '@typings/core';
import CoreInterface from '@utils/builders/CoreInterface';

interface Params {
  client: IExtendedClient;
  interaction: BaseInteraction;
}

/**
 * The daily question interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
export default new CoreInterface<Params>(async ({ client, interaction }) => {
  if (!interaction.guildId) throw new Error('No guild ID');

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const embed = new EmbedBuilder()
    .setTitle(translations.dailySettings.embed.title)
    .setColor(config.colors.primary)
    .setDescription(
      translations.dailySettings.embed.description
        .replace('{name}', translations.name)
        .replace(
          '{enabled}',
          guildProfile.daily.enabled
            ? config.emojis.check.full
            : config.emojis.close.full
        )
        .replace(
          '{channel}',
          guildProfile.daily.channel
            ? `<#${guildProfile.daily.channel}>`
            : config.emojis.close.full
        )
        .replace(
          '{role}',
          guildProfile.daily.role
            ? `<@&${guildProfile.daily.role}>`
            : config.emojis.close.full
        )
        .replace('{time}', guildProfile.daily.time)
        .replace(
          '{thread}',
          guildProfile.daily.thread
            ? config.emojis.check.full
            : config.emojis.close.full
        )
    );

  const useButtonStyle = guildProfile.daily.enabled
    ? ButtonStyle.Success
    : ButtonStyle.Secondary;

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `daily*enabled-${guildProfile.daily.enabled ? 'false' : 'true'}`
      )
      .setLabel(
        translations.dailySettings.buttons[
          guildProfile.daily.enabled ? 'disable' : 'enable'
        ]
      )
      .setStyle(
        guildProfile.daily.enabled ? ButtonStyle.Danger : ButtonStyle.Success
      ),
    new ButtonBuilder()
      .setCustomId('daily*channel')
      .setLabel(translations.dailySettings.buttons.channel)
      .setStyle(
        guildProfile.daily.enabled ? ButtonStyle.Success : ButtonStyle.Secondary
      )
      .setDisabled(!guildProfile.daily.enabled),
    new ButtonBuilder()
      .setCustomId('daily*role')
      .setLabel(translations.dailySettings.buttons.role)
      .setStyle(useButtonStyle)
      .setDisabled(!guildProfile.daily.enabled),
    new ButtonBuilder()
      .setCustomId('daily*time')
      .setLabel(translations.dailySettings.buttons.time)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!guildProfile.daily.enabled)
      .setEmoji('⏰'),
    new ButtonBuilder()
      .setCustomId('daily*thread')
      .setLabel(
        translations.dailySettings.buttons.thread[
          guildProfile.daily.thread ? 'disable' : 'enable'
        ]
      )
      .setStyle(useButtonStyle)
      .setDisabled(!guildProfile.daily.enabled)
  );

  return {
    content: '',
    buttons: [buttons],
    embeds: [embed],
  };
}).build();
