import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Link to our support server')
    .setDMPermission(true)
    .setDescriptionLocalizations({
      'de': 'Link zu unserem Support Server',
      'es-ES': 'Link para nuestro servidor de soporte',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const supportembed = new EmbedBuilder()
    .setColor(config.colors.danger)
    .setTitle(translations.support.embed.title)
    .setDescription(translations.support.embed.description)
    .setTimestamp();

  const supportbutton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Support Server')
      .setStyle(ButtonStyle.Link)
      .setEmoji('💻')
      .setURL(config.links.support)
  );

  return interaction
    .reply({
      embeds: [supportembed],
      components: [supportbutton],
    })
    .catch(client.logger.error);
});
