import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "classicMode",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const check = guildDb.classicMode;
    const emb = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.utilityTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.username",
        )}: ${guildDb.webhookName ? guildDb.webhookName : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.avatar",
        )}: ${guildDb.webhookAvatar ? `[Image](<${guildDb.webhookAvatar}>)` : ":x:"}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.classicMode",
        )}: ${check ? ":x:" : ":white_check_mark:"}`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("webhookName")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.name"),
          )
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("webhookAvatar")
          .setEmoji("1207801424503644260")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.avatar"),
          )
          .setStyle(
            guildDb.webhookAvatar ? ButtonStyle.Success : ButtonStyle.Secondary,
          ),
      );

    const button2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("classicMode")
          .setEmoji("1256977616242606091")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.classicMode",
            ),
          )
          .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success),
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      classicMode: !check,
    });

    interaction.update({
      content: null,
      embeds: [emb],
      components: [button, button2],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
