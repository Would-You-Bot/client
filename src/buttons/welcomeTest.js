const { EmbedBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
module.exports = {
  data: {
    name: "welcomeTest",
    description: "Welcome Test",
  },
  async execute(interaction, client, guildDb) {
    const { General } = await require(
      `../data/rather-${guildDb.language}.json`,
    );
    const { WhatYouDo } = await require(
      `../data/wwyd-${guildDb.language}.json`,
    );

    let randomDaily = [];
    if (guildDb.customTypes === "regular") {
      let array = [];
      array.push(...General, ...WhatYouDo);
      randomDaily = array[Math.floor(Math.random() * array.length)];
    } else if (guildDb.customTypes === "mixed") {
      let array = [];
      if (guildDb.customMessages.filter((c) => c.type !== "nsfw").length != 0) {
        array.push(
          guildDb.customMessages.filter((c) => c.type !== "nsfw")[
            Math.floor(
              Math.random() *
                guildDb.customMessages.filter((c) => c.type !== "nsfw").length,
            )
          ].msg,
        );
      } else {
        randomDaily = [...General, ...WhatYouDo];
      }
      array.push(...General, ...WhatYouDo);
      randomDaily = array[Math.floor(Math.random() * array.length)];
    } else if (guildDb.customTypes === "custom") {
      if (
        guildDb.customMessages.filter((c) => c.type !== "nsfw").length === 0
      ) {
        return this.client.webhookHandler
          .sendWebhook(
            channel,
            guildDb.dailyChannel,
            {
              content:
                "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
            },
            guildDb.dailyThread,
          )
          .catch((err) => {
            Sentry.captureException(err);
          });
      }

      randomDaily = guildDb.customMessages.filter((c) => c.type !== "nsfw")[
        Math.floor(
          Math.random() *
            guildDb.customMessages.filter((c) => c.type !== "nsfw").length,
        )
      ].msg;
    }

    let mention = null;
    if (guildDb.welcomePing) {
      mention = `<@${interaction.member.user.id}>`;
    }

    let welcomeEmbed = new EmbedBuilder()
      .setTitle(
        `${client.translation.get(guildDb?.language, "Welcome.embed.title")} ${
          interaction.member.user.username
        }!`,
      )
      .setColor("#0598F6")
      .setThumbnail(interaction.member.user.avatarURL())
      .setDescription(randomDaily);

    return interaction.reply({
      content: `${client.translation.get(
        guildDb.language,
        "Settings.welcomeTestSuccess",
      )}\n\n ${mention ? mention : ""}`,
      embeds: [welcomeEmbed],
      ephemeral: true,
    });
  },
};
