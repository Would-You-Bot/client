const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const Sentry = require("@sentry/node");
const guildModel = require("../util/Models/guildModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Link to our support server")
    .setDMPermission(true)
    .setDescriptionLocalizations({
      de: "Link zu unserem Support Server",
      "es-ES": "Link para nuestro servidor de soporte",
      fr: "Lien vers notre serveur d'assistance",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    const supportembed = new EmbedBuilder()
      .setColor("#F00505")
      .setTitle(
        client.translation.get(guildDb?.language, "Support.embed.title"),
      )
      .setDescription(
        client.translation.get(guildDb?.language, "Support.embed.description"),
      )
      .setFooter({
        text: client.translation.get(guildDb?.language, "Support.embed.footer"),
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp();

    const supportbutton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(5)
        .setEmoji("💻")
        .setURL("https://discord.gg/vMyXAxEznS"),
    );

    return interaction
      .reply({
        embeds: [supportembed],
        components: [supportbutton],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
