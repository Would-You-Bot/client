import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "welcome",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const check = guildDb.welcome;

    const truncateString = (str: string, maxLength: number) => {
      // Remove line breaks first
      const cleanedStr = str.replace(/\n/g, " ");
      return cleanedStr.length > maxLength
        ? `${cleanedStr.substring(0, maxLength)}...`
        : cleanedStr;
    };

    const welcomes = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcome",
        )}: ${check ? ":x:" : ":white_check_mark:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomePing",
        )}: ${guildDb.welcomePing ? ":white_check_mark:" : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyType",
        )}: ${guildDb.welcomeType}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeChannel",
        )}: ${guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeMessage",
        )}: ${
          guildDb.welcomeMessage
            ? truncateString(guildDb.welcomeMessage, 100)
            : ":x:"
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const welcomeButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomeType")
          .setEmoji("1185973664538177557")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyType",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("1185973667973320775"),
        new ButtonBuilder()
          .setCustomId("welcomeChannel")
          .setEmoji("1185973667973320775")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeChannel",
            ),
          )
          .setStyle(
            guildDb.welcomeChannel
              ? ButtonStyle.Primary
              : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("welcomeTest")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeTest",
            ),
          )
          .setDisabled(!!check)
          .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Primary)
          .setEmoji("1207800685928910909"),
      );
    const welcomeButtons2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcome")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcome",
            ),
          )
          .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("welcomePing")
          .setEmoji("1207801424503644260")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomePing",
            ),
          )
          .setStyle(
            guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
      );

    const welcomeButtons3 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("welcomeMessage")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.welcomeMessage",
            ),
          )
          .setStyle(
            guildDb.welcomeMessage
              ? ButtonStyle.Primary
              : ButtonStyle.Secondary,
          ),
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcome: !check,
    });

    interaction.update({
      content: null,
      embeds: [welcomes],
      components: [welcomeButtons2, welcomeButtons, welcomeButtons3],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
