import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelType,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} from 'discord.js';

import config from '@config';
import { CoreButton } from '@utils/builders';

export default new CoreButton({
  id: 'welcome',
  description: 'Edit welcome settings',
}).execute(async (client, interaction: ButtonInteraction, args: string[]) => {
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
              .setDescription(translations.welcomeSettings.content.channel),
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
              .setDescription(translations.welcomeSettings.content.role),
          ],
          components: [roleMenu],
        });
      }
      break;

    default:
      return null;
  }
});
