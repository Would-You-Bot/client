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
  // Create a string for each channel's question type setting
  const channelSettings =
    guildDb.channelTypes
      .map((ch) => `<#${ch.channelId}>: ${ch.questionType}`)
      .join("\n") || client.translation.get(guildDb?.language, "Settings.embed.noChannel");

  // Embed with replaced translation strings and updated fields
  const emb = new EmbedBuilder()
    .setTitle(client.translation.get(guildDb?.language, "Settings.embed.questionTitle"))
    .setDescription(
      `${client.translation.get(guildDb?.language, "Settings.embed.globalType")} ${guildDb.customTypes}\n${client.translation.get(guildDb?.language, "Settings.embed.channelType")} \n${channelSettings}`,
    )
    .setColor("#0598F6")
    .setFooter({
      text: client.translation.get(guildDb?.language, "Settings.embed.footer"),
      iconURL: client.user?.displayAvatarURL() || undefined,
    });

  // Button to set the global question type
  const buttonGlobal =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("customTypes")
        .setLabel(client.translation.get(guildDb?.language, "Settings.button.globalType"))
        .setStyle(ButtonStyle.Primary),
    );

  // Button to configure per-channel types
  const buttonPerChannel =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("setPerChannel")
        .setLabel(client.translation.get(guildDb?.language, "Settings.button.channelType"))
        .setStyle(ButtonStyle.Secondary),
    );

  await interaction.reply({
    embeds: [emb],
    components: [buttonGlobal, buttonPerChannel],
    ephemeral: true,
  });
}
