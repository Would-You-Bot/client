import { ComponentType, ModalSubmitInteraction } from 'discord.js';

import { CoreModal } from '@typings/core';
import { validateTime } from '@utils/functions';
import { ExtendedClient } from 'src/client';
import dailyMessageInterface from 'src/interfaces/settings/dailyMessage';

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

    const guildProfile = await client.guildProfiles.fetch(interaction.guild.id);
    const translations = client.translations[guildProfile.language];

    // Check if the time is the same as the currently set one one
    if (guildProfile.daily.time === value)
      return interaction.reply({
        ephemeral: true,
        content: translations.settings.timezone.same,
      });

    //            const roleMenu = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
    if (!validateTime(value))
      return interaction.reply({
        ephemeral: true,
        content: translations.settings.daily.content.invalidTime,
      });

    // Update the daily time
    await guildProfile.update({
      'daily.time': value,
    });

    const useInterface = dailyMessageInterface(client, guildProfile);

    return interaction.update({
      content: '',
      embeds: [useInterface.embed],
      components: [useInterface.buttons],
    });
  },
};

export default modal;
