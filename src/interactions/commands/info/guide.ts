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

  /**
   * Replace the variables in a string.
   * @param input The input.
   * @returns The input with the variables replaced.
   */
  const replaceVars = (input: string): string =>
    input.replaceAll('{name}', client.user?.username ?? 'Would You');

  const guideEmbed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(replaceVars(translations.guide.embed.title))
    .addFields(
      translations.guide.embed.fields.map((field) => ({
        name: replaceVars(field.name),
        value: replaceVars(field.value),
      }))
    )
    .setDescription(replaceVars(translations.guide.embed.description))
    .setImage(
      `https://images-ext-2.discordapp.net/external/paKraxSLIB_oRkXYpdu4i4apCXqD-wPUN81-JZV8EGI/https/i.imgur.com/nA0yA0V.png?width=497&height=561`
    );

  interaction.reply({
    embeds: [guideEmbed],
  });
});
