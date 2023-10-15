import {
  ButtonBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "paginateFirst",
  execute: async (interaction, client, guildDb) => {
    const paginate = client.paginate.get(interaction.user.id);
    if (!paginate) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "wyCustom.error.issue",
        ),
        ephemeral: true,
      });
      return;
    }

    const buttons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("paginateFirst")
          .setLabel("⏪")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("paginatePrev")
          .setLabel("◀️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("paginateNext")
          .setLabel("▶️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("paginateLast")
          .setLabel("⏩")
          .setStyle(ButtonStyle.Secondary),
      );

    await interaction.update({
      embeds: [paginate.pages[0]],
      components: [buttons],
      options: {
        ephemeral: true,
      },
    });

    clearTimeout(paginate.timeout);
    const time = setTimeout(() => {
      if (client.paginate.get(interaction.user.id))
        client.paginate.delete(interaction.user.id);
    }, paginate.time);
    paginate.timeout = time;

    paginate.page = 0;
  },
};

export default button;
