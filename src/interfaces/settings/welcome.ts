import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  EmbedBuilder,
} from 'discord.js';

import { IExtendedClient } from '@typings/core';
import CoreInterface from '@utils/builders/CoreInterface';

interface Params {
  client: IExtendedClient;
  interaction: BaseInteraction;
}

/**
 * The function return the default interface.
 * @param client The extended client.
 * @param guildProfile The guild profile.
 * @returns An object containing the embed and buttons.
 */
export default new CoreInterface<Params>(async ({ client, interaction }) => {
  if (!interaction.guildId) throw new Error('No guild ID');

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  return {
    embeds: [new EmbedBuilder().setDescription(translations.name)],
    buttons: [new ActionRowBuilder<ButtonBuilder>()],
  };
}).build();
