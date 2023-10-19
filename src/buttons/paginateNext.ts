import {
  ButtonBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonStyle,
} from "discord.js";
import { Button } from "../models";

const button: Button = {
  name: "paginateNext",
  execute: async (interaction, client, guildDb) => {
    const paginate = client.paginate.get(
      `${interaction.user.id}-${interaction.message.reference?.messageId}`,
    );

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

    if (paginate.page + 1 === paginate.pages.length - 1) {
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

      clearTimeout(paginate.timeout);
      const time = setTimeout(() => {
        if (
          client.paginate.get(
            `${interaction.user.id}-${interaction.message.reference?.messageId}`,
          )
        )
          client.paginate.delete(
            `${interaction.user.id}-${interaction.message.reference?.messageId}`,
          );
      }, paginate.time);
      paginate.timeout = time;

      await interaction.update({
        embeds: [paginate.pages[++paginate.page]],
        components: [buttons],
        options: {
          ephemeral: true,
        },
      });
      return;
    } else {
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
            .setCustomId("paginateNext")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("paginateLast")
            .setLabel("⏩")
            .setStyle(ButtonStyle.Secondary),
        );

      clearTimeout(paginate.timeout);
      const time = setTimeout(() => {
        if (
          client.paginate.get(
            `${interaction.user.id}-${interaction.message.reference?.messageId}`,
          )
        )
          client.paginate.delete(
            `${interaction.user.id}-${interaction.message.reference?.messageId}`,
          );
      }, paginate.time);
      paginate.timeout = time;

      await interaction.update({
        embeds: [paginate.pages[++paginate.page]],
        components: [buttons],
        options: {
          ephemeral: true,
        },
      });
      return;
    }
  },
};

export default button;
