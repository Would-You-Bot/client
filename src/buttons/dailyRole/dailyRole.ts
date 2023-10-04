import {
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "dailyRole",
  execute: async(interaction, client, guildDb) => {
    let inter;
    let inter2;
    if (guildDb?.dailyRole) {
      (inter = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      )),
        (inter2 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("deleteDailyRole")
            .setLabel("Delete Daily Role")
            .setStyle(ButtonStyle.Danger),
        ));
    } else {
      inter = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      );
    }

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.dailyRole"),
      components: guildDb?.dailyRole ? [inter, inter2] as any : [inter],
      options:{
        ephemeral: true
      }
    });
  },
};

export default button;