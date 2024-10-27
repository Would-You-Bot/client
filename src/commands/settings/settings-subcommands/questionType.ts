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
      .join("\n") || "No specific channel settings";

  // Embed with replaced translation strings and updated fields
  const emb = new EmbedBuilder()
    .setTitle("Would You - Question Types")
    .setDescription(
      `**Global Question Type**: ${guildDb.customTypes}\n**Per-Channel Settings**: \n${channelSettings}`,
    )
    .setColor("#0598F6")
    .setFooter({
      text: "Would You",
      iconURL: client.user?.displayAvatarURL() || undefined,
    });

  // Button to set the global question type
  const buttonGlobal =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("customTypes")
        .setLabel("Set Global Question Type")
        .setStyle(ButtonStyle.Primary),
    );

  // Button to configure per-channel types
  const buttonPerChannel =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("setPerChannel")
        .setLabel("Configure Per-Channel Types")
        .setStyle(ButtonStyle.Secondary),
    );

  await interaction.reply({
    embeds: [emb],
    components: [buttonGlobal, buttonPerChannel],
    ephemeral: true,
  });
}
