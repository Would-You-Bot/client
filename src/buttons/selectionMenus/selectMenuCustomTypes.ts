import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "selectMenuCustomTypes",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const value = (interaction as any).values[0];

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      customTypes: value,
    });

    const emb = new EmbedBuilder()
      .setTitle("Would You - Question Types")
      .setDescription(
        `**Global Question Type**: ${value}\n**Per-Channel Settings**: \n${
          guildDb.channelTypes
            .map((ch) => `<#${ch.channelId}>: ${ch.questionType}`)
            .join("\n") || "No specific channel settings"
        }`
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
          .setStyle(ButtonStyle.Primary)
      );

    // Button to configure per-channel types
    const buttonPerChannel =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("setPerChannel")
          .setLabel("Configure Per-Channel Types")
          .setStyle(ButtonStyle.Secondary)
      );

    interaction.update({
      content: null,
      embeds: [emb],
      components: [buttonGlobal, buttonPerChannel],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
