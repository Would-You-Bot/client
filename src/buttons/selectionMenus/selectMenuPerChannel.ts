import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

const typeRegex = /^(regular|custom|mixed)$/;

const button: Button = {
  name: "selectMenuPerChannel",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const newChannel = (interaction as any).values[0];
    const chan = interaction.guild?.channels.cache.get(newChannel);
    const { data } = await new Modal({
      title: `${chan?.name}'s Question Type`,
      customId: "questionTypePerChannel",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "Choose: Regular, Custom, or Mixed",
          required: true,
          placeholder: guildDb.customTypes,
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;
    if (!typeRegex.test(value as string)) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(guildDb?.language, "Settings.button.typeRegex"),
      });
      return;
    }

    if (guildDb.channelTypes.find((c) => c.channelId === newChannel)) {
      guildDb.channelTypes = guildDb.channelTypes.filter(
        (c) => c.channelId !== newChannel,
      );
    }

    guildDb.channelTypes.push({
      channelId: newChannel,
      questionType: value as "regular" | "custom" | "mixed",
    });

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      channelTypes: guildDb.channelTypes,
    });

    const emb = new EmbedBuilder()
      .setTitle(client.translation.get(guildDb?.language, "Settings.embed.questionTitle"))
      .setDescription(
        `${client.translation.get(guildDb?.language, "Settings.embed.globalType")}  ${guildDb.customTypes}\n${client.translation.get(guildDb?.language, "Settings.embed.channelType")} \n${guildDb.channelTypes.map((c) => `<#${c.channelId}>: ${c.questionType}`).join("\n")}`,
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

    await (data?.modal as any).update({
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
