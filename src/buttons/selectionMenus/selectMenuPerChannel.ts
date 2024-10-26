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
        content:
          "You must provide a valid type: `regular`, `custom`, or `mixed`.",
      });
      return;
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
      .setTitle("Would You - Question Types")
      .setDescription(
        `**Global Question Type**: ${guildDb.customTypes}\n**Per-Channel Settings**: \n${guildDb.channelTypes.map((c) => `<#${c.channelId}>: ${c.questionType}`).join("\n")}`
      )
      .setColor("#0598F6")
      .setFooter({
        text: "Would You",
        iconURL: client.user?.displayAvatarURL() || undefined,
      });

    const buttonGlobal =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("customTypes")
          .setLabel("Set Global Question Type")
          .setStyle(ButtonStyle.Primary)
      );

    const buttonPerChannel =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("setPerChannel")
          .setLabel("Configure Per-Channel Types")
          .setStyle(ButtonStyle.Secondary)
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
