import { WebhookClient, EmbedBuilder, Guild } from "discord.js";
import { captureException } from "@sentry/node";
import "dotenv/config";
import WouldYou from "../util/wouldYou";
import { Event } from "../models";
import { GuildModel } from "../util/Models/guildModel";
import { WebhookCache } from "../util/Models/webhookCache";

const event: Event = {
  event: "guildDelete",
  execute: async (client: WouldYou, guild: Guild) => {
    if (!guild?.name) return;

    console.log(`Left ${guild.name} (${guild.id})`);
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
          .setTitle(`← Left Server`)
          .setColor(`#f00704`)
          .setThumbnail(
            guild.iconURL({
              extension: "png",
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
      const webhookClient = new WebhookClient({
        url: process.env.LOG_GUILDS as string,
      });

      await webhookClient
        .send({
          content: `<:BadCheck:1025490660968628436> Left ${guild.name} ${features}. I'm now in ${client.guilds.cache.size} guilds.`,
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
