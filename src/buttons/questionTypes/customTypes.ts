import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "customTypes",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("selectMenuCustomTypes")
          .setPlaceholder("Click on the type you want to set globally.")
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("Regular")
              .setValue("regular"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Mixed")
              .setValue("mixed"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Custom")
              .setValue("custom"),
          )
      );

    interaction.update({
      embeds: [],
      content: "Click on the type you want to set globally.",
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
