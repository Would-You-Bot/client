import { tests } from 'builder-validation';
import { ComponentType } from 'discord.js';

import CoreModal from '@utils/builders/CoreModal';
import dailySettingsInterface from 'src/interfaces/settings/daily';

export default new CoreModal({
  id: 'daily-time',
  description: 'Daily time customization',
}).execute(async (client, interaction): Promise<unknown> => {
  if (!interaction.isFromMessage()) return;
  if (!interaction.guild) return;

  if (interaction.components[0].components[0].type !== ComponentType.TextInput)
    return;
  const value = interaction.components[0].components[0].value;

  const guildProfile = await client.guildProfiles
    .fetch(interaction.guild.id)
    .catch((error) => {
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

  const useInterface = await dailySettingsInterface({ client, interaction });

  return interaction.update(useInterface);
});
