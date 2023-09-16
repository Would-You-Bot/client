const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");
const Sentry = require("@sentry/node");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("A list of every command")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Eine Liste aller Befehle",
      "es-ES": "Una lista de todos los comandos",
      fr: "Une liste de chaque commande",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    const languageMappings = {
      de_DE: "de",
      en_EN: "en",
      es_ES: "es",
      fr_FR: "fr",
    };

    const commands = await client.application.commands.fetch({
      withLocalizations: true,
    });
    const type = languageMappings[guildDb?.language] || "en";
    const helpembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Help.embed.footer"),
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Help.embed.title"))
      .addFields({
        name: client.translation.get(
          guildDb?.language,
          "Help.embed.Fields.privacyname",
        ),
        value: client.translation.get(
          guildDb?.language,
          "Help.embed.Fields.privacy",
        ),
        inline: false,
      })
      .setDescription(
        client.translation.get(guildDb?.language, "Help.embed.description") +
          `\n\n${commands
            .filter((e) => e.name !== "reload")
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(
              (n) =>
                `</${n.name}:${n.id}> - ${
                  type === "de"
                    ? n.descriptionLocalizations.de
                    : type === "es"
                    ? n.descriptionLocalizations["es-ES"]
                    : type === "fr"
                    ? n.descriptionLocalizations.fr
                    : n.description
                }`,
            )
            .join("\n")}`,
      );

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(
          client.translation.get(guildDb?.language, "Help.button.title"),
        )
        .setStyle(5)
        .setEmoji("💫")
        .setURL("https://discord.gg/vMyXAxEznS"),
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle(5)
        .setEmoji("1009964111045607525")
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
        ),
    );
    await interaction
      .reply({
        embeds: [helpembed],
        components: [button],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
