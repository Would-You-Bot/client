import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "paginateLast",
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
          .setCustomId("paginateFirst")
          .setLabel("⏪")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("paginatePrev")
          .setLabel("◀️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("paginateNext")
          .setLabel("▶️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setDisabled(true)
          .setCustomId("paginateLast")
          .setLabel("⏩")
          .setStyle(ButtonStyle.Secondary),
      );

    await interaction.update({
      embeds: [paginate.pages[paginate.pages.length - 1]],
      components: [buttons],
      options: {
        ephemeral: true,
      },
    });

    clearTimeout(paginate.timeout);
    const time = setTimeout(() => {
      if (client.paginate.get(interaction.user))
        client.paginate.delete(interaction.user);
    }, paginate.time);
    paginate.timeout = time;

    paginate.page = paginate.pages.length - 1;
  },
};

export default button;
