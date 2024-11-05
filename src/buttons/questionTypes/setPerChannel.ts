import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
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
          .setPlaceholder(
            client.translation.get(
              guildDb?.language,
              "Settings.button.setChannel",
            ),
          )
          .addChannelTypes(ChannelType.GuildText),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.button.setChannel",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
