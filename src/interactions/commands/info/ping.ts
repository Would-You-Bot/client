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
    .setName('ping')
    .setDescription('Displays the clients ping')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Zeigt den Ping des Clients an',
      'es-ES': 'Muestra el ping del cliente',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;
  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const pingembed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(translations.ping.embed.title)
    .addFields(
      {
        name: translations.ping.embed.client,
        value: `> **${Math.abs(Date.now() - interaction.createdTimestamp)}**ms`,
        inline: false,
      },
      {
        name: translations.ping.embed.api,
        value: `> **${Math.round(client.ws.ping)}**ms`,
        inline: false,
      }
    )
    .setTimestamp();

  const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(translations.ping.buttons.label)
      .setStyle(ButtonStyle.Link)
      .setEmoji('💻')
      .setURL('https://discordstatus.com/')
  );
  await interaction
    .reply({
      embeds: [pingembed],
      components: [button],
      ephemeral: true,
    })
    .catch(client.logger.error);
});
