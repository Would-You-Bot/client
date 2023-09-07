require("dotenv").config();
const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = async (client, guild) => {
  if (!guild?.name) return;

  // Create and save the settings in the cache so that we don't need to do that at a command run
  await client.database.getGuild(guild?.id, true);

  const webhookPrivate = new WebhookClient({ url: process.env.WEBHOOKPRIVATE });

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
    avatarURL: "https://wouldyoubot.gg/static/img/round.webp", // Make sure to update this if you ever change the link thx <3
    username: global?.devBot ? "Dev Bot" : "Main Bot",
    embeds: [
      new EmbedBuilder()
        .setTitle(`→ Joined Server`)
        .setColor(`#0598F4`)
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
    const webhookClient = new WebhookClient({ url: LOG_GUILDS});

    await webhookClient
      .send({
        content: `<:GoodCheck:1025490645525209148> Joined ${guild.name}. I'm now in ${client.guilds.cache.size} guilds.`,
        username: `${guild.name
          .replace("Discord", "")
          .replace("discord", "")
          .replace("Everyone", "")
          .replace("everyone", "")}`,
        avatarURL: guild.iconURL({ format: "webp", dynamic: true, size: 1024 }),
        allowedMentions: { parse: [] },
      })
      .catch((err) => console.log(err));
  }
};
