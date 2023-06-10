import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';

import { CoreInterfaceFunction } from '@typings/core';

/**
 * The function return the default interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
export default <CoreInterfaceFunction>((client, guildProfile) => {
  const translations = client.translations[guildProfile.language];

  return {
    embeds: [new EmbedBuilder().setDescription(translations.name)],
    buttons: [new ActionRowBuilder<ButtonBuilder>()],
  };
});
