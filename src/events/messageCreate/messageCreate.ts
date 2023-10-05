import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionFlagsBits,
  Message,
  GuildTextBasedChannel,
  MessageActionRowComponentBuilder,
} from "discord.js";
import Sentry from "@sentry/node";
import WouldYou from "../../util/wouldYou";
import { Event } from "../../models/event";
const Cooldown = new Set();

const event: Event = {
  event: "messageCreate",
  execute: async (client: WouldYou, message: Message<boolean>) => {
    // Always check the permissions before doing any actions to avoid a ratelimit IP ban =)
    if (message.guild?.members.me &&
      (message?.channel as GuildTextBasedChannel)
        ?.permissionsFor(message.guild.members.me)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.EmbedLinks,
        ])
    ) {
      if (Cooldown.has(message?.channel?.id)) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: "Hello, my name is Would You.",
          iconURL:
            "https://cdn.discordapp.com/emojis/953349395955470406.gif?size=40&quality=lossless",
        })
        .setDescription(
          `My purpose is to help users have better engagement in your servers to bring up more activity! You can use </help:982400982921138226> to see all of my commands.`,
        )
        .setColor("#0598F6");

      const supportbutton = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Invite")
          .setStyle(5)
          .setEmoji("📋")
          .setURL(
            "https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands",
          ),
        new ButtonBuilder()
          .setLabel("Support")
          .setStyle(5)
          .setEmoji("❤️")
          .setURL("https://discord.gg/vMyXAxEznS"),
      );

      Cooldown.add(message?.channel?.id);
      setTimeout(() => {
        Cooldown.delete(message?.channel?.id);
      }, 10000);

      if (
        message.content &&
        new RegExp(`^(<@!?${client?.user?.id}>)`).test(message.content)
      )
        message.channel
          .send({
            embeds: [embed],
            components: [supportbutton],
          })
          .catch((err: Error) => {
            Sentry.captureException(err);
          });
        return;
    }
  },
};

export default event;
