import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
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
          .setPlaceholder("Select a type")
          .addOptions([
            {
              label: "Would You Rather",
              value: "wouldyourather",
              description:
                "This changes Daily Messages to use Would You Rather questions.",
            },
            {
              label: "Never Have I Ever",
              value: "neverhaveiever",
              description:
                "This changes Daily Messages to use Never Have I Ever questions.",
            },
            {
              label: "What Would You Do",
              value: "wwyd",
              description:
                "This changes Daily Messages to use What Would You Do questions.",
            },
            {
              label: "Truth",
              value: "truth",
              description:
                "This changes Daily Messages to use Truth questions.",
            },
            {
              label: "Dare",
              value: "dare",
              description: "This changes Daily Messages to use Dare questions.",
            },
            {
              label: "Topic",
              value: "topic",
              description:
                "This changes Daily Messages to use Topic questions.",
            },
          ])
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
