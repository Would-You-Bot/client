import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  RoleSelectMenuBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "dailyRole",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      );

    const inter2 =
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
