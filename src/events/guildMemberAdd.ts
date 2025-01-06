import { captureException } from "@sentry/node";
import {
  type GuildMember,
  type GuildTextBasedChannel,
  PermissionFlagsBits,
} from "discord.js";
import "dotenv/config";
import type { Event } from "../interfaces";
import { getQuestionsByType } from "../util/Functions/jsonImport";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "guildMemberAdd",
  execute: async (client: WouldYou, member: GuildMember) => {
    if (member?.user?.bot) return;

    const guildDb = await client.database.getGuild(member.guild.id, false);
    if (!guildDb || !guildDb?.welcome) return;
    const channel = (await member.guild.channels
      .fetch(guildDb.welcomeChannel)
      .catch((err: Error) => {
        captureException(err);
      })) as GuildTextBasedChannel;

    if (!channel?.id) return;

    if (
      member.guild.members.me &&
      !channel
        ?.permissionsFor(member.guild.members.me)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
        ])
    )
      return;

    const premium = await client.premium.check(member?.guild.id);

    const General = await getQuestionsByType(
      guildDb.welcomeChannel,
      "wouldyourather",
      guildDb,
      guildDb?.language != null ? guildDb.language : "en_EN",
      premium.result,
      false,
    );
    const WhatYouDo = await getQuestionsByType(
      guildDb.welcomeChannel,
      "whatwouldyoudo",
      guildDb,
      guildDb?.language != null ? guildDb.language : "en_EN",
      premium.result,
      false,
    );

    const randomMessage = Math.random() > 0.5 ? General : WhatYouDo;

    const placeholderMap: Record<string, string> = {
      "{{user_displayname}}": member.user.displayName,
      "{{user_tag}}": member.user.username,
      "{{@mention}}": `<@${member.user.id}>`,
      "{{guild_name}}": member.guild.name,
      "{{guild_member_count}}": member.guild.memberCount.toString(),
      "{{question}}": randomMessage.question,
      "{{new_line}}": "\n",
    };

    const messageTemplate =
      guildDb.welcomeMessage ??
      `${client.translation.get(guildDb?.language, "Welcome.embed.title")} ${
        guildDb.welcomePing ? `<@${member.user.id}>` : `${member.user.username}`
      }! ${randomMessage.question}`;

    const message = Object.entries(placeholderMap).reduce(
      (msg, [placeholder, value]) => {
        return msg.replace(new RegExp(placeholder, "g"), value);
      },
      messageTemplate,
    );

    channel
      .send({
        content: message,
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default event;
