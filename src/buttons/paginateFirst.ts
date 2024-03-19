import {
  ButtonBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../interfaces";

const button: Button = {
  name: "paginateFirst",
  execute: async (interaction, client, guildDb) => {
    let type: any = null;
    let paginate = client.paginate.get(
      `${interaction.user.id}-${interaction.message.interaction?.id}`,
    );

    if (!paginate)
      (paginate = client.paginate.get(
        `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
      )),
        (type = "reference");

    if (!paginate)
      (paginate = client.paginate.get(
        `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
      )),
        (type = "leaderboard");

    if (!paginate)
      (paginate = client.paginate.get(`${interaction.user.id}-custom`)),
        (type = "custom");

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

    if (paginate.pages.length === 1) {
      interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "wyCustom.error.noPages",
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
      if (
        type === "reference" &&
        client.paginate.get(
          `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-reference-${interaction.message.reference?.messageId}`,
        );
      } else if (
        type === "custom" &&
        client.paginate.get(`${interaction.user.id}-custom`)
      ) {
        client.paginate.delete(`${interaction.user.id}-custom`);
      } else if (
        type === "leaderboard" &&
        client.paginate.get(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-leaderboard-${interaction.message.interaction?.id}`,
        );
      } else if (
        client.paginate.get(
          `${interaction.user.id}-${interaction.message.interaction?.id}`,
        )
      ) {
        client.paginate.delete(
          `${interaction.user.id}-${interaction.message.interaction?.id}`,
        );
      }
    }, paginate.time);
    paginate.timeout = time;

    paginate.page = 0;
  },
};

export default button;
