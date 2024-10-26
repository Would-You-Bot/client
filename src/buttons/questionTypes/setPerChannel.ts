import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "setPerChannel",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("selectMenuPerChannel")
          .setPlaceholder("Select a channel")
          .addChannelTypes(ChannelType.GuildText)
          );

    interaction.update({
      embeds: [],
      content: "Select a channel you want to add a question type to.",
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
