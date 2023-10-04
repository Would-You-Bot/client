import { EmbedBuilder, GuildMember, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import "dotenv/config";
import Sentry from "@sentry/node";
import WouldYou from "../../util/wouldYou";
import { Event } from "../../models/event";
import { getWouldYouRather, getWwyd } from "../../util/Functions/jsonImport";

const event: Event = {
  event: "guildMemberAdd",
  execute: async (client: WouldYou, member: GuildMember) => {
    // Always do simple if checks before the main code. This is a little but not so little performance boost :)
    if (member?.user?.bot) return;

    const guildDb = await client.database.getGuild(member.guild.id, false);
    if (guildDb && guildDb?.welcome) {
      const channel = await member.guild.channels
        .fetch(guildDb.welcomeChannel)
        .catch((err: Error) => {
          Sentry.captureException(err);
        }) as GuildTextBasedChannel;

      if (!channel?.id) return;

      if (member.guild.members.me &&
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

      let randomDaily = [];
      if (guildDb.customTypes === "regular") {
        let array = [];
        array.push(...General, ...WhatYouDo);
        randomDaily = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.customTypes === "mixed") {
        let array = [];
        if (
          guildDb.customMessages.filter((c: any) => c.type !== "nsfw").length !=
          0
        ) {
          array.push(
            guildDb.customMessages.filter((c: any) => c.type !== "nsfw")[
              Math.floor(
                Math.random() *
                  guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
                    .length,
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
          guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
            .length === 0
        ) {
          client.webhookHandler
            .sendWebhook(
              channel,
              guildDb.dailyChannel,
              {
                content:
                  "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
              },
              guildDb.dailyThread,
            )
            .catch((err) => {
              Sentry.captureException(err);
            });
            return;
        }

        randomDaily = guildDb.customMessages.filter(
          (c: any) => c.type !== "nsfw",
        )[
          Math.floor(
            Math.random() *
              guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
                .length,
          )
        ].msg;
      }

      if (guildDb.customTypes === "regular") {
        let array = [];
        array.push(...General, ...WhatYouDo);
        randomDaily = array[Math.floor(Math.random() * array.length)];
      } else if (guildDb.customTypes === "mixed") {
        let array = [];
        if (
          guildDb.customMessages.filter((c: any) => c.type !== "nsfw").length !=
          0
        ) {
          array.push(
            guildDb.customMessages.filter((c: any) => c.type !== "nsfw")[
              Math.floor(
                Math.random() *
                  guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
                    .length,
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
          guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
            .length === 0
        ) {
           client.webhookHandler
            .sendWebhook(
              channel,
              guildDb.dailyChannel,
              {
                content:
                  "There's currently no custom Would You messages to be displayed for daily messages! Either make new ones or turn off daily messages.",
              },
              guildDb.dailyThread,
            )
            .catch((err) => {
              Sentry.captureException(err);
            });
            return;
        }

        randomDaily = guildDb.customMessages.filter(
          (c: any) => c.type !== "nsfw",
        )[
          Math.floor(
            Math.random() *
              guildDb.customMessages.filter((c: any) => c.type !== "nsfw")
                .length,
          )
        ].msg;
      }

      let mention = undefined;
      if (guildDb.welcomePing) {
        mention = `<@${member.user.id}>`;
      }

      let welcomeEmbed = new EmbedBuilder()
        .setTitle(
          `${client.translation.get(
            guildDb?.language,
            "Welcome.embed.title",
          )} ${member.user.username}!`,
        )
        .setColor("#0598F6")
        .setThumbnail(member.user.avatarURL())
        .setDescription(randomDaily);

      channel
        .send({ content: mention, embeds: [welcomeEmbed] })
        .catch((err: any) => {
          Sentry.captureException(err);
        });
      return;
    }
  },
};

export default event;
