import { ActionRowBuilder, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder } from 'discord.js';

import config from '@config';
import { CoreButton } from '@typings/core';

export default <CoreButton>{
  id: 'general',
  description: 'Button description',
  /**
   * The function that is executed when the button is pressed.
   * @param client The extended client.
   * @param interaction The button interaction.
   * @param args The arguments passed to the button.
   * @returns A promise that resolves to an unknown value.
   */
  execute: async (client, interaction, args: string[]) => {
    if (!interaction.guildId) return;

    const setting = args[0];

    // Fetch the guild profile
    const guildProfile = await client.guildProfiles.fetch(interaction.guildId).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    // Check if the guild profile exists
    if (!guildProfile) return;

    const translations = client.translations[guildProfile.language];

    switch (setting) {
      case 'question-type':
        {
          const questionTypeMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('general-question-type')
              .setPlaceholder('Select a type')
              .addOptions([
                {
                  label: 'Regular',
                  value: 'regular',
                  description: 'This changes it to use only default messages.',
                },
                {
                  label: 'Mixed',
                  value: 'mixed',
                  description: 'This changes it to use both custom & default messages.',
                },
                {
                  label: 'Custom',
                  value: 'custom',
                  description: 'This changes it to use only custom messages.',
                },
              ])
          );

          await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setColor(config.colors.primary)
                .setDescription(translations.settings.general.content.questionType),
            ],
            components: [questionTypeMenu],
          });
        }

        break;

      case 'timezone':
        {
          const modal = new ModalBuilder()
            .setCustomId('general-timezone')
            .setTitle('Daily Message Timezone')
            .addComponents(
              new ActionRowBuilder<TextInputBuilder>().addComponents(
                new TextInputBuilder()
                  .setCustomId('input')
                  .setLabel('Provide a timezone')
                  .setMaxLength(50)
                  .setMinLength(3)
                  .setRequired(true)
              )
            );

          await interaction.showModal(modal);
        }
        break;

      default:
        return null;
    }
  },
};
