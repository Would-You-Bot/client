import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
  RoleSelectMenuBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "customPerm",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuCustomRole")
          .setPlaceholder("Select a role that can add custom messages."),
      );

    const inter2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("deleteCustomPerm")
          .setLabel("Delete Custom Permission Role")
          .setStyle(ButtonStyle.Danger),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.customPerm"),
      components: guildDb?.customPerm ? [inter, inter2] : [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
