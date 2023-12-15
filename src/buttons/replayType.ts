import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../models";

const button: Button = {
  name: "replayType",
  execute: async (interaction, client, guildDb) => {
    const newType = guildDb.replayType === "Channels" ? "Guild" : "Channels";
    const generalMsg = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.generalTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.replayBy",
        )}: ${guildDb.replayBy}\n${
          guildDb.replayBy === "Guild"
            ? client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy2",
              )
            : client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy1",
              )
        }\n\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.replayType",
        )}: ${newType}\n${
          guildDb.replayType === "Channels"
            ? `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayCooldown",
              )}: ${guildDb.replayCooldown}`
            : `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayChannels",
              )}: ${
                guildDb.replayChannels.length > 0
                  ? `\n${guildDb.replayChannels
                      .map((c) => `<#${c.id}>: ${c.cooldown}`)
                      .join("\n")}`
                  : client.translation.get(
                      guildDb?.language,
                      `Settings.embed.replayChannelsNone`,
                    )
              }`
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

    const generalButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(
            guildDb.replayType === "Channels"
              ? "replayCooldown"
              : "replayChannels",
          )
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayCooldown",
            ),
          )
          .setStyle(
            guildDb.replayCooldown
              ? ButtonStyle.Success
              : ButtonStyle.Secondary,
          ),
        new ButtonBuilder()
          .setCustomId("replayType")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayType",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("📝"),
        new ButtonBuilder()
          .setCustomId("replayBy")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayBy",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("📝"),
      );

    const chanDelete =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("replayDeleteChannels")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayDeleteChannels",
            ),
          )
          .setStyle(ButtonStyle.Danger),
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      replayType: newType,
    });

    interaction.update({
      content: null,
      embeds: [generalMsg],
      components:
        newType === "Channels"
          ? [generalButtons, chanDelete]
          : [generalButtons],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
