import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildLanguage } from '@typings/guild';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Hilfe Befehl!',
      'es-ES': 'Comando de ayuda!',
    }),
}).execute(async (client, interaction) => {
  if (!client.application || !interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const translations = client.translations[guildProfile.language];

  const commands = await client.application.commands.fetch({
    withLocalizations: true,
  });

  const helpembed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setTitle(translations.help.embed.title)
    .setDescription(
      `${translations.help.embed.description}\n\n${commands
        .sort((first, second) => first.name.localeCompare(second.name))
        .map(
          (cmd) =>
            `</${cmd.name}:${cmd.id}> - ${
              guildProfile.language === GuildLanguage.German
                ? cmd.descriptionLocalizations?.de ?? 'No description'
                : guildProfile.language === GuildLanguage.Spanish
                ? cmd.descriptionLocalizations?.['es-ES'] ?? 'No description'
                : cmd.description
            }`
        )
        .join('\n')}`
    )
    .addFields(translations.help.embed.fields)
    .setTimestamp();

  const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel(translations.help.buttons.label)
      .setStyle(ButtonStyle.Link)
      .setEmoji('💫')
      .setURL(config.links.support),
    new ButtonBuilder()
      .setLabel('Invite')
      .setStyle(ButtonStyle.Link)
      .setEmoji(config.emojis.logo.id)
      .setURL(config.links.invite)
  );
  await interaction
    .reply({
      embeds: [helpembed],
      components: [button],
    })
    .catch(client.logger.error);
});
