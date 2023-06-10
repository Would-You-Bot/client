import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import { GuildLanguage } from '@typings/guild';
import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the language for the current guild')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      'de': 'Ändere die Sprache für den aktuellen Server',
      'es-ES': 'Cambiar el idioma del bot en el servidor',
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('english')
        .setDescription('Set the language to english')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('german').setDescription('Set the language to german')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('spanish')
        .setDescription('Set the language to spanish')
    ),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const guildProfile = await client.guildProfiles.fetch(interaction.guildId);

  const languageEmbed = new EmbedBuilder();

  switch (interaction.options.getSubcommand()) {
    case 'english': {
      await guildProfile.update({ language: GuildLanguage.English });

      languageEmbed
        .setTitle('Language changed!')
        .setDescription('English has been selected as the new language!')
        .setFooter({
          text: 'Would You',
          iconURL: client.user?.avatarURL() ?? undefined,
        });
      break;
    }
    case 'german': {
      await guildProfile.update({ language: GuildLanguage.German });

      languageEmbed
        .setTitle('Sprache bearbeitet!')
        .setDescription('Deutsch wurde als neue Sprache ausgewählt!')
        .setFooter({
          text: 'Would You',
          iconURL: client.user?.avatarURL() ?? undefined,
        });
      break;
    }
    case 'spanish': {
      await guildProfile.update({ language: GuildLanguage.Spanish });

      languageEmbed
        .setTitle('¡Idioma cambiado!')
        .setDescription('¡Has seleccionado el español como nuevo idioma!')
        .setFooter({
          text: 'Would You',
          iconURL: client.user?.avatarURL() ?? undefined,
        });
      break;
    }
    default: {
      languageEmbed
        .setTitle('Error!')
        .setDescription('Something went wrong, please try again later!')
        .setFooter({
          text: 'Would You',
          iconURL: client.user?.avatarURL() ?? undefined,
        });
      break;
    }
  }

  return interaction
    .reply({
      embeds: [languageEmbed],
      ephemeral: true,
    })
    .catch(client.logger.error);
});
