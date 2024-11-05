import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
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
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.questionTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(guildDb?.language, "Settings.embed.globalType")}  ${value}\n${client.translation.get(guildDb?.language, "Settings.embed.channelType")} \n${
          guildDb.channelTypes
            .map((ch) => `<#${ch.channelId}>: ${ch.questionType}`)
            .join("\n") ||
          client.translation.get(guildDb?.language, "Settings.embed.noChannel")
        }`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client.user?.displayAvatarURL() || undefined,
      });

    // Button to set the global question type
    const buttonGlobal =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("customTypes")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.globalType",
            ),
          )
          .setStyle(ButtonStyle.Primary),
      );

    // Button to configure per-channel types
    const buttonPerChannel =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("setPerChannel")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.channelType",
            ),
          )
          .setStyle(ButtonStyle.Secondary),
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
