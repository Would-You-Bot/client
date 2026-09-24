import { captureException } from "@sentry/node";
import {
  ColorResolvable,
  EmbedBuilder,
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
    try {
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

      const randomType =
        Math.random() > 0.5 ? "wouldyourather" : "whatwouldyoudo";

      const randomMessage = await await getQuestionsByType(
        guildDb.welcomeChannel,
        randomType,
        guildDb,
        guildDb?.language != null ? guildDb.language : "en_EN",
        premium.result,
        false,
      );

      const placeholderMap: Record<string, string> = {
        "{{user_displayname}}": member.user.displayName,
        "{{user_tag}}": member.user.username,
        "{{user_avatarUrl}}":
          member.user.avatarURL() ??
          "https://cdn.discordapp.com/embed/avatars/5.png",
        "{{@mention}}": `<@${member.user.id}>`,
        "{{guild_name}}": member.guild.name,
        "{{guild_member_count}}": member.guild.memberCount.toString(),
        "{{guild_iconUrl}}":
          member.guild.iconURL() ??
          "https://cdn.discordapp.com/embed/avatars/5.png",
        "{{question}}": randomMessage.question,
        "{{new_line}}": "\n",
      };

      function Message(message: string) {
        return Object.entries(placeholderMap).reduce(
          (msg, [placeholder, value]) => {
            return msg.replace(new RegExp(placeholder, "g"), value);
          },
          message,
        );
      }

      const messageTemplate =
        guildDb.welcomeMessage ??
        `${client.translation.get(guildDb?.language, "Welcome.embed.title")} ${
          guildDb.welcomePing
            ? `<@${member.user.id}>`
            : `${member.user.username}`
        }! ${randomMessage.question}`;

      const embed = new EmbedBuilder()
        .setColor((guildDb.welcomeEmbedColor as ColorResolvable) || null)
        .setTitle(
          guildDb?.welcomeEmbedTitle
            ? Message(guildDb.welcomeEmbedTitle)
            : null,
        )
        .setURL(guildDb.welcomeEmbedTitleURL || null)
        .setDescription(
          guildDb?.welcomeEmbedDescription
            ? Message(guildDb.welcomeEmbedDescription)
            : null,
        )
        .setThumbnail(guildDb.welcomeEmbedThumbnail || null)
        .setImage(guildDb.welcomeEmbedImage || null)
        .setTimestamp(guildDb.welcomeEmbedTimestamp ? Date.now() : null);

      if (guildDb.welcomeEmbedFooterText && guildDb.welcomeEmbedFooterURL) {
        embed.setFooter({
          text: Message(guildDb.welcomeEmbedFooterText),
          iconURL: guildDb.welcomeEmbedFooterURL,
        });
      } else if (guildDb.welcomeEmbedFooterText) {
        embed.setFooter({
          text: Message(guildDb.welcomeEmbedFooterText),
        });
      }

      if (guildDb.welcomeEmbedAuthorName && guildDb.welcomeEmbedAuthorURL) {
        embed.setAuthor({
          name: Message(guildDb.welcomeEmbedAuthorName),
          iconURL: guildDb.welcomeEmbedAuthorURL,
        });
      } else if (guildDb.welcomeEmbedAuthorName) {
        embed.setAuthor({
          name: Message(guildDb.welcomeEmbedAuthorName),
        });
      }

      channel
        .send({
          content: !guildDb.welcomeEmbed
            ? Message(messageTemplate)
            : guildDb.welcomeEmbedContent
              ? Message(guildDb.welcomeEmbedContent)
              : undefined,
          embeds: guildDb.welcomeEmbed ? [embed] : [],
        })
        .catch((err: Error) => {
          captureException(err);
        });
      return;
    } catch (err) {
      console.log(err);
    }
  },
};

export default event;
