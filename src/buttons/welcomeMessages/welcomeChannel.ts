import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "welcomeChannel",
  execute: async (interaction, client, guildDb) => {
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ChannelSelectMenuBuilder()
          .setCustomId("selectMenuWelcome")
          .setPlaceholder("Select a channel")
          .addChannelTypes(ChannelType.GuildText),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.dailyChannel",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
