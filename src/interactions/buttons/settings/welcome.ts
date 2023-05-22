import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} from 'discord.js';

import config from '@config';
import { CoreButton } from '@typings/core';

export default <CoreButton>{
  id: 'welcome',
  description: 'Edit welcome settings',
  perUser: false,
  /**
   * The function that is executed when the button is pressed.
   * @param client The extended client.
   * @param interaction The button interaction.
   * @param args The arguments passed to the button.
   * @returns A promise that resolves to an unknown value.
   */
  execute: async (client, interaction: ButtonInteraction, args: string[]) => {
    if (!interaction.guildId) return;

    const setting = args[0];

    const guildProfile = await client.guildProfiles.fetch(interaction.guildId).catch((error) => {
      client.logger.error(error);
      return undefined;
    });

    if (!guildProfile) return null;

    const translations = client.translations[guildProfile.language];

    switch (setting) {
      case 'channel':
        {
          // Create the channel menu
          const channelMenu = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
              .setCustomId('welcome-channel')
              .setPlaceholder('Select a channel')
              .addChannelTypes(ChannelType.GuildText)
          );

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(config.colors.primary)
                .setDescription(translations.settings.welcome.content.channel),
            ],
            components: [channelMenu],
          });
        }

        break;

      case 'role':
        {
          // Create the role menu
          const roleMenu = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder().setCustomId('welcome-role').setPlaceholder('Select a role')
          );

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(config.colors.primary)
                .setDescription(translations.settings.welcome.content.role),
            ],
            components: [roleMenu],
          });
        }
        break;

      default:
        return null;
    }
  },
};
