import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../interfaces";

const button: Button = {
  name: "wycustom_decline",
  execute: async (interaction, client, guildDb) => {
    const typeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedRemoveAll.decline",
        ),
      )
      .setColor("#0598F4")
      .setFooter({
        text: "Would You",
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Accept")
          .setStyle(4)
          .setDisabled(true)
          .setCustomId("accept"),
        new ButtonBuilder()
          .setLabel("Decline")
          .setStyle(2)
          .setDisabled(true)
          .setCustomId("decline"),
      );

    interaction.update({ embeds: [typeEmbed], components: [button] });
    return;
  },
};

export default button;
