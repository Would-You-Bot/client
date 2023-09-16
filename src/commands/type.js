const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const Sentry = require("@sentry/node");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("type")
    .setDescription("Changes the type of messages that will be used.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Ändert den Typ der Nachrichten, die verwendet werden.",
      "es-ES": "Cambia el tipo de mensajes que se utilizarán.",
      fr: "Modifie le type de messages qui seront utilisés.",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("regular")
        .setDescription("This changes it to use only default messages."),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mixed")
        .setDescription(
          "This changes it to use both custom & default messages.",
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("custom")
        .setDescription("This changes it to use only custom messages."),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */

  async execute(interaction, client, guildDb) {
    let typeEmbed;

    if (
      interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) ||
      global.checkDebug(guildDb, interaction?.user?.id)
    ) {
      switch (interaction.options.getSubcommand()) {
        case "regular":
          await client.database.updateGuild(
            interaction.guildId,
            {
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
            interaction.guildId,
            {
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
            interaction.guildId,
            {
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

      return interaction
        .reply({
          embeds: [typeEmbed],
          ephemeral: true,
        })
        .catch((err) => {
          Sentry.captureException(err);
        });
    } else {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Settings.embed.error"),
        );

      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          Sentry.captureException(err);
        });
    }
  },
};
