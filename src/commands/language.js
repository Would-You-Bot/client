const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("Change the language for the current guild")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Ändere die Sprache für den aktuellen Server",
      "es-ES": "Cambiar el idioma del bot en el servidor",
    })
    .addStringOption(option =>
      option.setName('language')
        .setDescription('The language you want to use.')
        .setRequired(true)
    .addChoices(
      { name: 'Deutsch', value: 'german' },
      { name: 'English', value: 'english' },
      { name: 'Español', value: 'spanish' },
    )),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    let languageembed;
    if (
      interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
    ) {
      switch (interaction.options.getString("language")) {
        case "english": {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: "en_EN",
            },
            true,
          );

          languageembed = new EmbedBuilder()
            .setTitle("Language changed!")
            .setDescription("English has been selected as the new language!")
            .setFooter({
              text: "Would You",
              iconURL: client.user.avatarURL(),
            });
          break;
        }
        case "german": {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: "de_DE",
            },
            true,
          );

          languageembed = new EmbedBuilder()
            .setTitle("Sprache bearbeitet!")
            .setDescription("Deutsch wurde als neue Sprache ausgewählt!")
            .setFooter({
              text: "Would You",
              iconURL: client.user.avatarURL(),
            });
          break;
        }
        case "spanish": {
          await client.database.updateGuild(
            interaction.guildId,
            {
              language: "es_ES",
            },
            true,
          );

          languageembed = new EmbedBuilder()
            .setTitle("¡Idioma cambiado!")
            .setDescription("¡Has seleccionado el español como nuevo idioma!")
            .setFooter({
              text: "Would You",
              iconURL: client.user.avatarURL(),
            });
          break;
        }
      }

      return interaction
        .reply({
          embeds: [languageembed],
          ephemeral: true,
        })
        .catch((err) => {
          return;
        });
    } else {
      const errorembed = new EmbedBuilder()
        .setColor("#F00505")
        .setTitle("Error!")
        .setDescription(
          client.translation.get(guildDb?.language, "Language.embed.error"),
        );

      return interaction
        .reply({
          embeds: [errorembed],
          ephemeral: true,
        })
        .catch((err) => {
          return;
        });
    }
  },
};
