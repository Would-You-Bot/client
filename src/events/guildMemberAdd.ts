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

    channel
      .send({
        content: `${client.translation.get(guildDb?.language, "Welcome.embed.title")} ${
          guildDb.welcomePing
            ? `<@${member.user.id}>`
            : `${member.user.username}`
        }! ${randomMessage.question}`,
      })
      .catch((err: Error) => {
        captureException(err);
      });
    return;
  },
};

export default event;
