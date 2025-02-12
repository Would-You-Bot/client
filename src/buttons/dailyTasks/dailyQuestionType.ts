import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "dailyQuestionType",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("selectMenuQuestionType")
          .setPlaceholder("Enable/Disable Question Types")
          .setMinValues(1)
          .setMaxValues(5)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel(`Would You Rather`)
              .setDefault(guildDb.dailyQuestionType.includes("wyr"))
              .setValue("wyr"),
            new StringSelectMenuOptionBuilder()
              .setLabel(`What Would You Do`)
              .setDefault(guildDb.dailyQuestionType.includes("wwyd"))
              .setValue("wwyd"),
            new StringSelectMenuOptionBuilder()
              .setLabel(`Never Have I Ever`)
              .setDefault(guildDb.dailyQuestionType.includes("neverhaveiever"))
              .setValue("neverhaveiever"),
            new StringSelectMenuOptionBuilder()
              .setLabel(`Truth`)
              .setDefault(guildDb.dailyQuestionType.includes("truth"))
              .setValue("truth"),
            new StringSelectMenuOptionBuilder()
              .setLabel(`Dare`)
              .setDefault(guildDb.dailyQuestionType.includes("dare"))
              .setValue("dare")
          )
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.dailyQuestionType"
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
