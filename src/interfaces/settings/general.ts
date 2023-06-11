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
 * The interface for the general settings.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
export default new CoreInterface<Params>(async ({ client, interaction }) => {
  if (!interaction.guildId) throw new Error('No guild ID');

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const embed = new EmbedBuilder()
    .setTitle(translations.generalSettings.embed.title)
    .setColor(config.colors.primary)
    .setDescription(translations.generalSettings.embed.description);

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
}).build();
