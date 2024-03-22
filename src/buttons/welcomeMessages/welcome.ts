import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "welcome",
  execute: async (interaction, client, guildDb) => {
    const check = guildDb.welcome;

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
        )}: ${
          guildDb.welcomePing ? ":white_check_mark:" : ":x:"
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.welcomeChannel",
        )}: ${
          guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : ":x:"
        }\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyType",
          )}: ${guildDb.welcomeType}`,
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
            .setCustomId("welcome")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.welcome",
              ),
            )
            .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("welcomeChannel")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.welcomeChannel",
              ),
            )
            .setStyle(
              guildDb.welcomeChannel
                ? ButtonStyle.Success
                : ButtonStyle.Secondary,
            ),
        ),
      welcomeButtons2 =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("welcomePing")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.welcomePing",
              ),
            )
            .setStyle(
              guildDb.welcomePing ? ButtonStyle.Success : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("welcomeType")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyType",
              ),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📝"),
          new ButtonBuilder()
            .setCustomId("welcomeTest")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.welcomeTest",
              ),
            )
            .setStyle(ButtonStyle.Primary)
            .setEmoji("▶"),
        );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      welcome: !check,
    });

    interaction.update({
      content: null,
      embeds: [welcomes],
      components: [welcomeButtons, welcomeButtons2],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
