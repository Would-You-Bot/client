import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

import config from '@config';
import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreCommand } from '@typings/core';
import { ExtendedClient } from 'src/client';

const command: CoreCommand = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the language for the current guild')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      de: 'Ändere die Sprache für den aktuellen Server',
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
  async execute(
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    if (!interaction.guildId) return;

    let languageEmbed = new EmbedBuilder();

    if (client.checkDebug(guildDb, interaction?.user?.id)) {
      switch (interaction.options.getSubcommand()) {
        case 'english': {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: 'en_EN',
            },
            true
          );

          languageEmbed
            .setTitle('Language changed!')
            .setDescription('English has been selected as the new language!')
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
        case 'german': {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: 'de_DE',
            },
            true
          );

          languageEmbed
            .setTitle('Sprache bearbeitet!')
            .setDescription('Deutsch wurde als neue Sprache ausgewählt!')
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
        case 'spanish': {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: 'es_ES',
            },
            true
          );

          languageEmbed
            .setTitle('¡Idioma cambiado!')
            .setDescription('¡Has seleccionado el español como nuevo idioma!')
            .setFooter({
              text: 'Would You',
              iconURL: client.user?.avatarURL() || undefined,
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
    } else {
      const errorembed = new EmbedBuilder()
        .setColor(config.colors.danger)
        .setTitle('Error!')
        .setDescription(
          client.translation.get(guildDb?.language, 'Language.embed.error')
        );

      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch(client.logger.error);
    }
  },
};

export default command;
