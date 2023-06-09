import { tests } from 'builder-validation';
import { ComponentType, ModalSubmitInteraction } from 'discord.js';

import { CoreModal } from '@typings/core';
import { ExtendedClient } from 'src/client';
import dailySettingsInterface from 'src/interfaces/settings/daily';

const modal: CoreModal<ExtendedClient> = {
  id: 'daily-time',
  description: 'Daily time customization',
  /**
   * The function that is executed when the modal is submitted.
   * @param client The extended client.
   * @param interaction The modal interaction.
   * @returns A promise that resolves to an unknown value.
   */
  async execute(client: ExtendedClient, interaction: ModalSubmitInteraction): Promise<unknown> {
    if (!interaction.isFromMessage()) return;
    if (!interaction.guild) return;

    if (interaction.components[0].components[0].type !== ComponentType.TextInput) return;
    const value = interaction.components[0].components[0].value;

    const guildProfile = await client.guildProfiles.fetch(interaction.guild.id).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    if (!guildProfile) return;

    const translations = client.translations[guildProfile.language];

    // Check if the time is the same as the currently set one one
    if (guildProfile.daily.time === value)
      return interaction.reply({
        ephemeral: true,
        content: translations.dailySettings.content.sameTime,
      });

    //            const roleMenu = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
    if (!tests.validateTime(value))
      return interaction.reply({
        ephemeral: true,
        content: translations.dailySettings.content.invalidTime,
      });

    // Update the daily time
    await guildProfile.update({
      'daily.time': value,
    });

    const useInterface = dailySettingsInterface(client, guildProfile);

    return interaction.update({
      content: '',
      embeds: [useInterface.embed],
      components: [useInterface.buttons],
    });
  },
};

export default modal;
