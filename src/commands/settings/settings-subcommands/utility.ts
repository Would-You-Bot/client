import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ChatInputCommandInteraction,
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
    .setTitle("Would You - Utility")
    .setDescription(
      `${client.translation.get(
        guildDb?.language,
        "Settings.embed.username",
      )}: ${guildDb.webhookName ? guildDb.webhookName : ":x:"}\n${client.translation.get(
        guildDb?.language,
        "Settings.embed.avatar",
      )}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : ":x:"}\n${client.translation.get(
        guildDb?.language,
        "Settings.embed.classicMode",
      )}: ${guildDb.classicMode ? ":white_check_mark:" : ":x:"}`,
    )
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });

  const button =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("webhookName")
        .setEmoji("1185973660465500180")
        .setLabel(
          client.translation.get(guildDb?.language, "Settings.button.name"),
        )
        .setStyle(
          guildDb.webhookName ? ButtonStyle.Success : ButtonStyle.Secondary,
        ),
      new ButtonBuilder()
        .setCustomId("webhookAvatar")
        .setEmoji("1207801424503644260")
        .setLabel(
          client.translation.get(guildDb?.language, "Settings.button.avatar"),
        )
        .setStyle(
          guildDb.webhookAvatar ? ButtonStyle.Success : ButtonStyle.Secondary,
        ),
    );

  const button2 =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("classicMode")
        .setEmoji("1256977616242606091")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.classicMode",
          ),
        )
        .setStyle(
          guildDb.classicMode ? ButtonStyle.Success : ButtonStyle.Secondary,
        ),
    );

  await interaction.reply({
    embeds: [emb],
    components: [button, button2],
    ephemeral: true,
  });
}
