const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const guildModel = require("../util/Models/guildModel");
const Sentry = require("@sentry/node");

module.exports = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("guide")
    .setDescription("guide to use the bot and increase activity")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Anleitung, um den Bot zu verwenden und die Aktivität zu erhöhen",
      "es-ES": "Guía para usar el bot y aumentar la actividad",
      fr: "Un guide simple sur la façon d'utiliser le bot pour augmenter l'activité",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */

  async execute(interaction, client, guildDb) {
    const guideembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Guide.embed.footer"),
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Guide.embed.title"))
      .addFields(
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name1"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value1",
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name2"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value2",
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name3"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value3",
          ),
          inline: false,
        },
      )
      .setImage("https://i.imgur.com/nA0yA0V.png")
      .setDescription(
        client.translation.get(guildDb?.language, "Guide.embed.description"),
      );

    await interaction
      .reply({
        embeds: [guideembed],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
