const { WebhookClient, EmbedBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
require("dotenv").config();

module.exports = async (client, guild) => {
  if (!guild?.name) return;

  // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
  await client.database.deleteGuild(guild?.id, true);

  const webhookPrivate = new WebhookClient({ url: process.env.LOG_PRIVATE });

  let features;
  if (
    (guild.features && guild.features.includes("VERIFIED")) ||
    guild.features.includes("PARTNERED")
  ) {
    features = guild.features.includes("VERIFIED")
      ? `<:verified_green:1072265950134550548>`
      : `<:partner:1072265822577360982>`;
  }

  await webhookPrivate.send({
    avatarURL:
      "https://cdn.discordapp.com/avatars/981649513427111957/23da96bbf1eef64855a352e0e29cdc10.webp?size=96", // Make sure to update this if you ever change the link thx <3
    username: global?.devBot ? "Dev Bot" : "Main Bot",
    embeds: [
      new EmbedBuilder()
        .setTitle(`← Left Server`)
        .setColor(`#f00704`)
        .setThumbnail(
          guild.iconURL({
            format: "png",
            dynamic: true,
          }),
        )
        .setDescription(
          `**Name**: ${
            guild.name
          }\n**Users**: ${guild.memberCount.toLocaleString()}${
            features ? `\n**Features**: ${features}` : ``
          }`,
        )
        .setFooter({
          text: global?.devBot ? "Dev Bot" : "Main Bot",
        }),
    ],
    allowedMentions: { parse: [] },
  });

  if (!global?.devBot) {
    const webhookClient = new WebhookClient({ url: process.env.LOG_GUILDS });

    await webhookClient
      .send({
        content: `<:BadCheck:1025490660968628436> Left ${guild.name}. I'm now in ${client.guilds.cache.size} guilds.`,
        username: `${guild.name
          .replace("Discord", "")
          .replace("discord", "")
          .replace("Everyone", "")
          .replace("everyone", "")}`,
        avatarURL: guild.iconURL({ format: "webp", dynamic: true, size: 1024 }),
        allowedMentions: { parse: [] },
      })
      .catch((err) => Sentry.captureException(err));
  }
};
