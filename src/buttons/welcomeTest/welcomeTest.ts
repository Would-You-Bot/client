import { EmbedBuilder, User } from "discord.js";
import { captureException } from "@sentry/node";
import { Button } from "../../models";
import { getWouldYouRather, getWwyd } from "../../util/Functions/jsonImport";

const button: Button = {
  name: "welcomeTest",
  execute: async (interaction, client, guildDb) => {
    var General = await getWouldYouRather(guildDb.language);
    var WhatYouDo = await getWwyd(guildDb.language);

    let randomDaily;
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
        client.webhookHandler
          .sendWebhook(
            null,
            guildDb.dailyChannel,
            {
              content:
                "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
            },
            guildDb.dailyThread,
          )
          .catch((err) => {
            captureException(err);
          });
        return;
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
      mention = `<@${interaction.member?.user.id}>`;
    }

    let welcomeEmbed = new EmbedBuilder()
      .setTitle(
        `${client.translation.get(
          guildDb?.language,
          "Welcome.embed.title",
        )} ${interaction.member?.user.username}!`,
      )
      .setColor("#0598F6")
      .setThumbnail((interaction.member?.user as User).avatarURL())
      .setDescription(randomDaily);

    interaction.reply({
      content: `${client.translation.get(
        guildDb.language,
        "Settings.welcomeTestSuccess",
      )}\n\n ${mention ? mention : ""}`,
      embeds: [welcomeEmbed],
      ephemeral: true,
    });
    return;
  },
};

export default button;
