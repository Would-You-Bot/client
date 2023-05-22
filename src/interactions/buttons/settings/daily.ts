import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  RoleSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

import config from '@config';
import { CoreButton } from '@typings/core';
import dailySettingsInterface from 'src/interfaces/settings/daily';

export default <CoreButton>{
  id: 'daily',
  description: 'Edit the daily messages settings.',
  /**
   * The function that is executed when the button is pressed.
   * @param client The extended client.
   * @param interaction The button interaction.
   * @param args The arguments passed to the button.
   * @returns A promise that resolves to an unknown value.
   */
  execute: async (client, interaction, args: string[]) => {
    if (!interaction.guildId) return;

    const setting = args[1];
    const state = args[2];

    // Fetch the guild profile
    const guildProfile = await client.guildProfiles.fetch(interaction.guildId).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    // Check if the guild profile exists
    if (!guildProfile) return;

    const translations = client.translations[guildProfile.language];

    try {
      switch (setting) {
        case 'enabled':
          {
            // Check if the new state is valid
            if (state !== 'true' && state !== 'false') return;

            // Update the thread setting
            await guildProfile.update({
              'daily.enabled': state === 'true' ? true : false,
            });

            const useInterface = dailySettingsInterface(client, guildProfile);

            interaction.update({
              content: '',
              embeds: useInterface.embeds,
              components: useInterface.components,
            });
          }
          break;

        case 'channel':
          {
            // Create the channel menu
            const channelMenu = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
              new ChannelSelectMenuBuilder()
                .setCustomId('daily-channel')
                .setPlaceholder('Select a channel')
                .addChannelTypes(ChannelType.GuildText)
            );

            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(config.colors.primary)
                  .setDescription(translations.settings.daily.content.channel),
              ],
              components: [channelMenu],
            });
          }

          break;

        case 'role':
          {
            // Create the role menu
            const roleMenu = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
              new RoleSelectMenuBuilder().setCustomId('daily-role').setPlaceholder('Select a role')
            );

            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(config.colors.primary)
                  .setDescription(translations.settings.daily.content.role),
              ],
              components: [roleMenu],
            });
          }
          break;

        case 'time':
          {
            const modal = new ModalBuilder()
              .setTitle('Daily Messages Interval')
              .setCustomId('daily-interval')
              .setComponents(
                new ActionRowBuilder<TextInputBuilder>().setComponents(
                  new TextInputBuilder()
                    .setCustomId('input')
                    .setStyle(TextInputStyle.Short)
                    .setLabel('Enter a 24 hour dailymsg interval (HH:MM).')
                    .setMinLength(5)
                    .setMaxLength(5)
                    .setRequired(true)
                )
              );

            await interaction.showModal(modal);
          }
          break;

        case 'thread':
          {
            // Check if the new state is valid
            if (state !== 'true' && state !== 'false') return;

            // Update the thread setting
            await guildProfile.update({
              'daily.thread': state === 'true' ? true : false,
            });

            const useInterface = dailySettingsInterface(client, guildProfile);

            interaction.update({
              content: '',
              embeds: useInterface.embeds,
              components: useInterface.components,
            });

            interaction.reply({
              content: `The daily messages thread setting has been set to **${state}**.`,
              ephemeral: true,
            });
          }
          break;

        default:
          return null;
      }
    } catch (error) {
      interaction.reply({
        content: translations.error.interaction,
        ephemeral: true,
      });
    }
  },
};
