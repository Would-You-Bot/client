import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { IGuildModel } from "../../../util/Models/guildModel";
import WouldYou from "../../../util/wouldYou";

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
      )}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : `:x:`}`,
    )
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client?.user?.displayAvatarURL() || undefined,
    });

  const welcomeButtons =
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

  await interaction.reply({
    embeds: [emb],
    components: [welcomeButtons],
    ephemeral: true,
  });
}
