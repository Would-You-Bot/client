import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../models";

const button: Button = {
  name: "wycustom_remove",
  execute: async (interaction, client, guildDb) => {
    const id = interaction.customId.split("-")[1],
      data = client.customAdd.get(id);

    const typeEmbed = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedAdd.title",
        ),
      )
      .setColor("#0598F4")
      .setDescription(
        `**${client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedAdd.descID",
        )}**: ${id}\n**${client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedAdd.descCat",
        )}**: ${data.type}\n\n**${client.translation.get(
          guildDb?.language,
          "wyCustom.success.embedAdd.descCont",
        )}**: \`${data.original}\``,
      )
      .setFooter({
        text: `Would You`,
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Add")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
          .setCustomId("add"),
        new ButtonBuilder()
          .setLabel("Don't Add")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`remove`),
      );

    client.customAdd.delete(id);
    interaction.update({ embeds: [typeEmbed], components: [button] });
    return;
  },
};

export default button;
