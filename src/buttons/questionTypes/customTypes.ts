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
          .setPlaceholder(
            client.translation.get(
              guildDb?.language,
              "Settings.button.setGlobal",
            ),
          )
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
          ),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.button.setGlobal",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
