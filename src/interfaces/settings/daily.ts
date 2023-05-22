import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

import config from '@config';
import { CoreInterface } from '@typings/core';

/**
 * The daily question interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
export default <CoreInterface>((client, guildProfile) => {
  const translations = client.translations[guildProfile.language];

  const embed = new EmbedBuilder()
    .setTitle(translations.settings.daily.embed.title)
    .setColor(config.colors.primary)
    .setDescription(
      translations.settings.daily.embed.description
        .replace('{name}', translations.name)
        .replace('{enabled}', guildProfile.daily.enabled ? config.emojis.check.full : config.emojis.close.full)
        .replace(
          '{channel}',
          guildProfile.daily.channel ? `<#${guildProfile.daily.channel}>` : config.emojis.close.full
        )
        .replace('{role}', guildProfile.daily.role ? `<@&${guildProfile.daily.role}>` : config.emojis.close.full)
        .replace('{time}', guildProfile.daily.time)
        .replace('{thread}', guildProfile.daily.thread ? config.emojis.check.full : config.emojis.close.full)
    );

  const useButtonStyle = guildProfile.daily.enabled ? ButtonStyle.Success : ButtonStyle.Secondary;

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`daily*enabled-${guildProfile.daily.enabled ? 'false' : 'true'}`)
      .setLabel(translations.settings.daily.button.enabled[guildProfile.daily.enabled ? 'disable' : 'enable'])
      .setStyle(guildProfile.daily.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('daily*channel')
      .setLabel(translations.settings.daily.button.channel)
      .setStyle(guildProfile.daily.enabled ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setDisabled(!guildProfile.daily.enabled),
    new ButtonBuilder()
      .setCustomId('daily*role')
      .setLabel(translations.settings.daily.button.role)
      .setStyle(useButtonStyle)
      .setDisabled(!guildProfile.daily.enabled),
    new ButtonBuilder()
      .setCustomId('daily*time')
      .setLabel(translations.settings.daily.button.time)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!guildProfile.daily.enabled)
      .setEmoji('⏰'),
    new ButtonBuilder()
      .setCustomId('daily*thread')
      .setLabel(translations.settings.daily.button.thread[guildProfile.daily.thread ? 'disable' : 'enable'])
      .setStyle(useButtonStyle)
      .setDisabled(!guildProfile.daily.enabled)
  );

  return {
    buttons,
    embed,
  };
});
