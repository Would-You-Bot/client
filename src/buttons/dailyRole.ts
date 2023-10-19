import {
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../models";

const button: Button = {
  name: "dailyRole",
  execute: async (interaction, client, guildDb) => {
    var inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      );

    var inter2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("deleteDailyRole")
          .setLabel("Delete Daily Role")
          .setStyle(ButtonStyle.Danger),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.dailyRole"),
      components: guildDb?.dailyRole ? [inter, inter2] : [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
