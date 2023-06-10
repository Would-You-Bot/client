import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import config from '@config';
import { CoreInterfaceFunction } from '@typings/core';
import { GuildProfile } from '@utils/classes';
import { ExtendedClient } from 'src/client';

/**
 * The interface for the general settings.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
const generalSettingsInterface: CoreInterfaceFunction<
  ExtendedClient,
  GuildProfile
> = (client, guildProfile) => {
  const translations = client.translations[guildProfile.language];

  const embed = new EmbedBuilder()
    .setTitle(translations.settings.general.embed.title)
    .setColor(config.colors.primary)
    .setDescription(translations.settings.general.embed.description);

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId('general*question-type')
      .setLabel('Question Type')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('❓'),
    new ButtonBuilder()
      .setCustomId('general*timezone')
      .setLabel('Timezone')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🌍')
  );

  return {
    embeds: [embed],
    components: [row],
  };
};

export default generalSettingsInterface;
