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
  guildDb: IGuildModel
) {
  const emb = new EmbedBuilder()
    .setTitle(
      client.translation.get(guildDb?.language, "Settings.embed.beforeText")
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
            "Settings.button.cooldownButtons"
          )
        ),
      new ButtonBuilder()
        .setEmoji("1308673732478238740")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("cooldownCommands")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.cooldownCommands"
          )
        )
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
