import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "dailyMsg",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const check = guildDb.dailyMsg;
    const dailyMsgs = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, "Settings.embed.dailyTitle"),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyChannel",
        )}: ${guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyRole",
          )}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyType",
          )}: ${guildDb?.customTypes}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyTimezone",
          )}: ${guildDb.dailyTimezone}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyInterval",
          )}: ${guildDb.dailyInterval}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyThread",
          )}: ${guildDb.dailyThread ? ":white_check_mark:" : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.autoPin",
          )}: ${guildDb.autoPin ? ":white_check_mark:" : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyMsg",
          )}: ${check ? ":x:" : ":white_check_mark:"}`,
      )

      .setColor("#0598F6");
    const dailyButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("dailyChannel")
            .setEmoji("1185973667973320775")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyChannel",
              ),
            )
            .setStyle(
              guildDb.dailyChannel
                ? ButtonStyle.Primary
                : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("dailyRole")
            .setEmoji("1185973666811478117")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyRole",
              ),
            )
            .setStyle(
              guildDb.dailyRole ? ButtonStyle.Primary : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("dailyType")
            .setEmoji("1185973664538177557")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyType",
              ),
            )
            .setStyle(ButtonStyle.Primary),
        ),
      dailyButtons2 =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("dailyTimezone")
            .setEmoji("1185973663674150912")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyTimezone",
              ),
            )
            .setStyle(
              guildDb.dailyTimezone
                ? ButtonStyle.Success
                : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("dailyInterval")
            .setEmoji("1185973661736374405")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyInterval",
              ),
            )
            .setStyle(
              guildDb.dailyInterval
                ? ButtonStyle.Success
                : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("daySelection")
            .setEmoji("1220826970133368842")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.daySelect",
              ),
            )
            .setStyle(ButtonStyle.Success),
        ),
      dailyButtons3 =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("dailyThread")
            .setEmoji("1185973669059633304")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyThread",
              ),
            )
            .setStyle(
              guildDb.dailyThread ? ButtonStyle.Success : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("autoPin")
            .setEmoji("1189521962318450698")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.autoPin",
              ),
            )
            .setStyle(
              guildDb.autoPin ? ButtonStyle.Success : ButtonStyle.Secondary,
            ),
          new ButtonBuilder()
            .setCustomId("dailyMsg")
            .setEmoji("1185973660465500180")
            .setLabel(
              client.translation.get(
                guildDb?.language,
                "Settings.button.dailyMsg",
              ),
            )
            .setStyle(check ? ButtonStyle.Secondary : ButtonStyle.Success),
        );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      dailyMsg: check ? false : true,
    });

    interaction.update({
      content: null,
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2, dailyButtons3],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
