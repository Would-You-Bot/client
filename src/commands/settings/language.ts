import {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("Change the language for the current guild")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Ändere die Sprache für den aktuellen Server",
      "es-ES": "Cambiar el idioma del bot en el servidor",
      fr: "Changer la langue du serveur actuel",
    })
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("The language you want to use.")
        .setRequired(true)
        .addChoices(
          { name: "🇩🇪 Deutsch", value: "german" },
          { name: "🇺🇸 English", value: "english" },
          { name: "🇪🇸 Español", value: "spanish" },
          { name: "🇫🇷 Français", value: "french" }
        )
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    let languageembed;
    if (
      (interaction.member?.permissions as Readonly<PermissionsBitField>).has(
        PermissionFlagsBits.ManageGuild
      )
    ) {
      switch (interaction.options.getString("language")) {
        case "english": {
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              language: "en_EN",
            },
            true
          );

          languageembed = new EmbedBuilder()
            .setTitle("Language changed!")
            .setDescription("English has been selected as the new language!")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
        case "german": {
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              language: "de_DE",
            },
            true
          );

          languageembed = new EmbedBuilder()
            .setTitle("Sprache bearbeitet!")
            .setDescription("Deutsch wurde als neue Sprache ausgewählt!")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
        case "spanish": {
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              language: "es_ES",
            },
            true
          );

          languageembed = new EmbedBuilder()
            .setTitle("¡Idioma cambiado!")
            .setDescription("¡Has seleccionado el español como nuevo idioma!")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
        case "french": {
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              language: "fr_FR",
            },
            true
          );

          languageembed = new EmbedBuilder()
            .setTitle("Langue changée!")
            .setDescription("Français a été sélectionné comme nouvelle langue!")
            .setFooter({
              text: "Would You",
              iconURL: client.user?.avatarURL() || undefined,
            });
          break;
        }
      }

      interaction
        .reply({
          embeds: [languageembed as EmbedBuilder],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
      return;
    } else {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Language.embed.error")
        );

      interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
      return;
    }
  },
};

export default command;
