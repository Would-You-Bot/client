import { captureException } from "@sentry/node";
import { EmbedBuilder, Guild, WebhookClient } from "discord.js";
import "dotenv/config";
import { Event } from "../interfaces";
import WouldYou from "../util/wouldYou";

const event: Event = {
  event: "guildCreate",
  execute: async (client: WouldYou, guild: Guild) => {
    if (!guild?.name) return;

    let serverCount;
    const result = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size,
    );

    serverCount = result.reduce((prev, val) => prev + val, 0);

    // Create and save the settings in the cache so that we don't need to do that at a command run
    await client.database.getGuild(guild?.id, true);

    const webhookPrivate = new WebhookClient({
      url: process.env.LOG_PRIVATE as string,
    });

    let features = "";
    if (
      (guild.features && guild.features.includes("VERIFIED")) ||
      guild.features.includes("PARTNERED")
    ) {
      features = guild.features.includes("VERIFIED")
        ? "<:verified_green:1072265950134550548>"
        : "<:partner:1072265822577360982>";
    }

    await webhookPrivate.send({
      avatarURL:
        "https://cdn.discordapp.com/avatars/981649513427111957/23da96bbf1eef64855a352e0e29cdc10.webp?size=96", // Make sure to update this if you ever change the link thx <3
      username: global?.devBot ? "Dev Bot" : "Main Bot",
      embeds: [
        new EmbedBuilder()
          .setTitle(`→ Joined Server`)
          .setColor(`#0598F4`)
          .setThumbnail(
            guild.iconURL({
              extension: "png",
            }),
          )
          .setDescription(
            `**Name**: ${
              guild.name
            }\n**Users**: ${guild.memberCount.toLocaleString()}\n**Server Owner**: ${guild.ownerId}${
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
      const webhookClient = new WebhookClient({
        url: process.env.LOG_GUILDS as string,
      });

      await webhookClient
        .send({
          content: `<:GoodCheck:1025490645525209148> Joined ${guild.name} ${features}. I'm now in ${serverCount} guilds.`,
          username: `${guild.name
            .replace("Discord", "")
            .replace("discord", "")
            .replace("Everyone", "")
            .replace("everyone", "")}`,
          avatarURL:
            guild.iconURL({
              extension: "webp",
              size: 1024,
            }) || undefined,
          allowedMentions: { parse: [] },
        })
        .catch((err) => captureException(err));
    }
  },
};

export default event;
