import {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "replayDeleteChannels",
  execute: async (interaction, client, guildDb) => {
    if (guildDb.replayChannels.length <= 0) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelNone",
        ),
        ephemeral: true,
      });
      return;
    }
    const inter =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("replayDelete")
          .setPlaceholder("Select a channel to remove cooldown from")
          .addOptions(
            guildDb.replayChannels.map((channel) => {
              return {
                label: channel.name,
                value: channel.id,
              };
            }),
          ),
      );

    interaction.update({
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.replayChannel",
      ),
      components: [inter],
      options: {
        ephemeral: true,
      },
    });
  },
};

export default button;
