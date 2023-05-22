import { ModalSubmitInteraction } from 'discord.js';

import { CoreModal } from '@typings/core';
import { ExtendedClient } from 'src/client';
import generalSettingsInterface from 'src/interfaces/settings/general';

/**
 * Checks if the timezone is valid.
 * @param timezone The timezone to check.
 * @returns A boolean.
 */
function isValid(timezone: string): boolean {
  if (!Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return false;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (ex) {
    return false;
  }
}

/**
 * Checks if the timezone is a date type.
 * @param timezone The timezone to check.
 * @returns A boolean.
 */
function dateType(timezone: string): boolean {
  if (!timezone.includes('/')) return false;
  const text = timezone.split('/');

  if (text.length === 2) return true;
  else return false;
}

const modal: CoreModal<ExtendedClient> = {
  id: 'general-timezone',
  description: 'Edit the guilds timezone',
  /**
   * The function that is executed when the modal is submitted.
   * @param client The extended client.
   * @param interaction The modal interaction.
   * @returns A promise that resolves to an unknown value.
   */
  async execute(client: ExtendedClient, interaction: ModalSubmitInteraction): Promise<unknown> {
    if (!interaction.guild) return;
    if (!interaction.isFromMessage()) return;
    const input = interaction.fields.getTextInputValue('input');

    // Fetch the guild profile
    const guildProfile = await client.guildProfiles.fetch(interaction.guild.id).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    // Return of the guild profile doesn't exist
    if (!guildProfile) return;

    // Get the translations for the guild
    const translations = client.translations[guildProfile.language];

    // Check if the timezone is the same as the currently set one
    if (guildProfile.timezone.toLowerCase() === input.toLowerCase())
      return interaction.reply({
        ephemeral: true,
        content: translations.settings.general.content.sameTimezone,
      });

    // Check if the timezone is valid
    if (!isValid(input) || !dateType(input))
      return interaction.reply({
        ephemeral: true,
        content: translations.settings.general.content.sameTimezone,
      });

    // Update the timezone
    await guildProfile.update({
      timezone: input,
    });

    const useInterface = generalSettingsInterface(client, guildProfile);

    return interaction.update({
      content: '',
      embeds: useInterface.embeds,
      components: useInterface.components,
    });
  },
};

export default modal;
