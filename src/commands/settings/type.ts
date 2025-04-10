import { captureException } from "@sentry/node";
import {
  EmbedBuilder,
  PermissionFlagsBits,
  type PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("type")
    .setDescription("Changes the kind of questions you get")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescriptionLocalizations({
      de: "Ändert den Typ der Nachrichten, die verwendet werden",
      "es-ES": "Cambia el tipo de mensajes que se utilizarán",
      fr: "Modifie le type de messages qui seront utilisés",
      it: "Cambia il tipo di messaggi da utilizzare",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("regular")
        .setDescription("This changes it to use only default messages"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mixed")
        .setDescription(
          "This changes it to use both custom & default messages",
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("custom")
        .setDescription("This changes it to use only custom messages"),
    ),

  execute: async (interaction, client, guildDb) => {
    let typeEmbed: EmbedBuilder = new EmbedBuilder();
    if (
      (interaction.member?.permissions as Readonly<PermissionsBitField>).has(
        PermissionFlagsBits.ManageGuild,
      )
    ) {
      switch (interaction.options.getSubcommand()) {
        case "regular":
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customTypes: "regular",
            },
            true,
          );

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(guildDb?.language, "wyType.embed.title"),
            )
            .setDescription(
              client.translation.get(guildDb?.language, "wyType.embed.descDef"),
            );
          break;
        case "mixed":
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customTypes: "mixed",
            },
            true,
          );

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(guildDb?.language, "wyType.embed.title"),
            )
            .setDescription(
              client.translation.get(
                guildDb?.language,
                "wyType.embed.descBoth",
              ),
            );
          break;
        case "custom":
          await client.database.updateGuild(
            interaction.guildId || "",
            {
              ...guildDb,
              customTypes: "custom",
            },
            true,
          );

          typeEmbed = new EmbedBuilder()
            .setTitle(
              client.translation.get(guildDb?.language, "wyType.embed.title"),
            )
            .setDescription(
              client.translation.get(
                guildDb?.language,
                "wyType.embed.descCust",
              ),
            );
          break;
      }

      interaction
        .reply({
          embeds: [typeEmbed],
          ephemeral: true,
        })
        .catch((err) => {
          captureException(err);
        });
      return;
    }
    const errorembed = new EmbedBuilder()
      .setColor("#F00505")
      .setTitle("Error!")
      .setDescription(
        client.translation.get(guildDb?.language, "Settings.embed.error"),
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
  },
};

export default command;
