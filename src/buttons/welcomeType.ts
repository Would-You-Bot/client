import {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { Button } from "../models";

const button: Button = {
  name: "welcomeType",
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("selectMenuWelcomeType")
          .setPlaceholder("Select a type")
          .addOptions([
            {
              label: "Regular",
              value: "regular",
              description: "This changes it to use only default messages.",
            },
            {
              label: "Mixed",
              value: "mixed",
              description:
                "This changes it to use both custom & default messages.",
            },
            {
              label: "Custom",
              value: "custom",
              description: "This changes it to use only custom messages.",
            },
          ])
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.welcomeType"
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
