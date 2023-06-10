import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@config';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Guide to use the bot and increase activity')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Anleitung, um den Bot zu verwenden und die Aktivität zu erhöhen',
      'es-ES': 'Guía para usar el bot y aumentar la actividad',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) throw new Error('No guild ID');

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const guideEmbed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(translations.guide.embed.title)
    .addFields(translations.guide.embed.fields)
    .setDescription(translations.guide.embed.description)
    .setTimestamp();

  interaction.reply({
    embeds: [guideEmbed],
  });
});
