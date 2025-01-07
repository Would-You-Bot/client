import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { IGuildModel } from "../../../util/Models/guildModel";
import type WouldYou from "../../../util/wouldYou";

export default async function settingsGeneral(
  interaction: ChatInputCommandInteraction,
  client: WouldYou,
  guildDb: IGuildModel,
) {
  const emb = new EmbedBuilder()
    .setTitle(
      client.translation.get(
        guildDb?.language,
        "Settings.embed.cooldownsTitle",
      ),
    )
    .setDescription(
      `${client.translation.get(
        guildDb?.language,
        "Settings.embed.replayType",
      )}: ${guildDb.replayType}\n${client.translation.get(
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
      }\n${
        guildDb.replayType === "Channels"
          ? `${client.translation.get(guildDb?.language, "Settings.embed.replayChannels")}: ${
              guildDb.replayChannels.length > 0
                ? `\n${guildDb.replayChannels
                    .sort(
                      (a: any, b: any) => b.cooldown / 1000 - a.cooldown / 1000,
                    )
                    .map((c) => `<#${c.id}>: ${Number(c.cooldown) / 1000}s`)
                    .join("\n")}`
                : client.translation.get(
                    guildDb?.language,
                    "Settings.embed.replayChannelsNone",
                  )
            }`
          : `${client.translation.get(
              guildDb?.language,
              "Settings.embed.replayCooldown",
            )}: ${guildDb.replayCooldown / 1000}s`
      }`,
    )
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });

  const cooldownButtons =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setEmoji("1308672399188820023")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("cooldownButtons")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.cooldownButtons",
          ),
        ),
      new ButtonBuilder()
        .setEmoji("1308673732478238740")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("cooldownCommands")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.cooldownCommands",
          ),
        ),
    );

  await interaction
    .reply({
      embeds: [emb],
      components: [cooldownButtons],
      ephemeral: true,
    })
    .catch((err) => {
      captureException(err);
    });
}
