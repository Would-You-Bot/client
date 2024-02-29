import {
  GuildMember,
  GuildTextBasedChannel,
  PermissionFlagsBits,
} from "discord.js";
import "dotenv/config";
import { captureException } from "@sentry/node";
import WouldYou from "../util/wouldYou";
import { Event } from "../models";
import { getWouldYouRather, getWwyd } from "../util/Functions/jsonImport";

const event: Event = {
  event: "guildMemberAdd",
  execute: async (client: WouldYou, member: GuildMember) => {
    // Always do simple if checks before the main code. This is a little but not so little performance boost :)
    if (member?.user?.bot) return;

    const guildDb = await client.database.getGuild(member.guild.id, false);
    if (guildDb && guildDb?.welcome) {
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
      var General = await getWouldYouRather(guildDb.language);
      var WhatYouDo = await getWwyd(guildDb.language);

      let randomMessage;
      if (guildDb.welcomeType === "regular") {
        let array = [];
        array.push(...General, ...WhatYouDo);
        randomMessage = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.welcomeType === "mixed") {
        let array = [];
        if (
          guildDb.customMessages.filter((c) => c.type !== "nsfw").length != 0
        ) {
          array.push(
            guildDb.customMessages.filter((c) => c.type !== "nsfw")[
              Math.floor(
                Math.random() *
                  guildDb.customMessages.filter((c) => c.type !== "nsfw")
                    .length,
              )
            ].msg,
          );
        } else {
          randomMessage = [...General, ...WhatYouDo];
        }
        array.push(...General, ...WhatYouDo);
        randomMessage = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.welcomeType === "custom") {
        randomMessage = guildDb.customMessages.filter((c) => c.type !== "nsfw")[
          Math.floor(
            Math.random() *
              guildDb.customMessages.filter((c) => c.type !== "nsfw").length,
          )
        ].msg;
      }

      channel
        .send({
          content: `${client.translation.get(
            guildDb?.language,
            "Welcome.embed.title",
          )} ${
            guildDb.welcomePing
              ? `<@${member.user.id}>`
              : `${member.user.username}`
          }! ${randomMessage}`,
        })
        .catch((err: Error) => {
          captureException(err);
        });
      return;
    }
  },
};

export default event;
