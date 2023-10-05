const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
require("dotenv").config();
const Sentry = require("@sentry/node");

module.exports = async (client, member) => {
  // Always do simple if checks before the main code. This is a little but not so little performance boost :)
  if (member?.user?.bot) return;

  const guildDb = await client.database.getGuild(member.guild.id, false);
  if (guildDb && guildDb?.welcome) {
    const channel = await member.guild.channels
      .fetch(guildDb.welcomeChannel)
      .catch((err) => {
        Sentry.captureException(err);
      });

    if (!channel?.id) return;

    if (
      !channel
        ?.permissionsFor(client?.user?.id)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
        ])
    )
      return;
      const { General } = await require(`../data/rather-${guildDb.language}.json`);
      const { WhatYouDo } = await require(`../data/wwyd-${guildDb.language}.json`);

      let randomMessage = [];
      if (guildDb.welcomeType === "regular") {
        let array = [];
        array.push(...General, ...WhatYouDo);
        randomMessage = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.welcomeType === "mixed") {
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
          randomMessage = [...General, ...WhatYouDo];
        }
        array.push(...General, ...WhatYouDo);
        randomMessage = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.welcomeType === "custom") {
        if (guildDb.customMessages.filter((c) => c.type !== "nsfw").length === 0) {
        }

        randomMessage = guildDb.customMessages.filter((c) => c.type !== "nsfw")[
          Math.floor(
            Math.random() *
            guildDb.customMessages.filter((c) => c.type !== "nsfw").length,
          )
        ].msg;
      }

    return channel
      .send({ content: `${client.translation.get(guildDb?.language, "Welcome.embed.title")} ${guildDb.welcomePing ? `<@${member.user.id}>` : `${member.user.username}`}! ${randomMessage}` })
      .catch((err) => {
        Sentry.captureException(err);
      });
  }
};
