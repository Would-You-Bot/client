import { captureException } from "@sentry/node";
import { EmbedBuilder, type Guild, WebhookClient } from "discord.js";
import "dotenv/config";
import type { Event } from "../interfaces";
import { GuildModel } from "../util/Models/guildModel";
import { WebhookCache } from "../util/Models/webhookCache";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "guildDelete",
  execute: async (client: WouldYou, guild: Guild) => {
    if (!guild?.name) return;

    const result = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size,
    );

    const serverCount = result.reduce((prev, val) => prev + val, 0);

    const guildData = await GuildModel.findOneAndUpdate(
      { guildID: guild.id, dailyMsg: true },
      { dailyMsg: false },
    );

    await WebhookCache.findOneAndDelete({
      channelId: guildData?.dailyChannel,
    });

    // Only delete the guild settings from the cache we don't want a data lose but also don't need not used data in the cache :)
    await client.database.deleteGuild(guild?.id, true);

    const webhookPrivate = new WebhookClient({
      url: process.env.LOG_PRIVATE as string,
    });

    let features = "";
    if (
      guild.features?.includes("VERIFIED") ||
      guild.features.includes("PARTNERED")
    ) {
      features = guild.features.includes("VERIFIED")
        ? "<:verified_green:1072265950134550548>"
        : "<:partner:1072265822577360982>";
    }

    await webhookPrivate.send({
      avatarURL: "https://wouldyoubot.gg/Logo.png",
      username: "Would You",
      embeds: [
        new EmbedBuilder()
          .setTitle("← Left Server")
          .setColor("#f00704")
          .setThumbnail(
            guild.iconURL({
              extension: "png",
            }),
          )
          .addFields([
            { name: "Name", value: guild.name, inline: false },
            { name: "ID", value: guild.id, inline: false },
            {
              name: "Users",
              value: guild.memberCount.toLocaleString(),
              inline: false,
            },
            { name: "Server Owner", value: guild.ownerId, inline: false },
            ...(features
              ? [{ name: "Features", value: features, inline: false }]
              : []),
          ]),
      ],
      allowedMentions: { parse: [] },
    });

    if (!global?.devBot) {
      const webhookClient = new WebhookClient({
        url: process.env.LOG_GUILDS as string,
      });

      await webhookClient
        .send({
          content: `<:BadCheck:1025490660968628436> Left ${guild.name} ${features}. I'm now in ${serverCount} guilds.`,
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
