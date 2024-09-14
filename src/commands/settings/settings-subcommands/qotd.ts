import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ChatInputCommandInteraction,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { IGuildModel } from "../../../util/Models/guildModel";
import type WouldYou from "../../../util/wouldYou";

export default async function settingsGeneral(
  interaction: ChatInputCommandInteraction,
  client: WouldYou,
  guildDb: IGuildModel,
) {
  const emb = new EmbedBuilder()
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
        `${client.translation.get(guildDb?.language, "Settings.embed.dailyType")}: ${guildDb?.customTypes}\n` +
        `${client.translation.get(guildDb?.language, "Settings.embed.dailyTimezone")}: ${guildDb.dailyTimezone}\n` +
        `${client.translation.get(guildDb?.language, "Settings.embed.dailyInterval")}: ${guildDb.dailyInterval}\n` +
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
        )}: ${guildDb.dailyMsg ? ":white_check_mark:" : ":x:"}`,
    )
    .setColor("#0598F6");

  // First button row
  // Deals channel, role and type
  const dailyButtons1 =
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
          guildDb.dailyChannel ? ButtonStyle.Primary : ButtonStyle.Secondary,
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
    );

  // Second button row
  // Deals with timezone, date, and interval (time related stuff)
  const dailyButtons2 =
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
          guildDb.dailyTimezone ? ButtonStyle.Success : ButtonStyle.Secondary,
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
          guildDb.dailyInterval ? ButtonStyle.Success : ButtonStyle.Secondary,
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
    );

  // Third button row
  // Deals with toggles
  const dailyButtons3 =
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
          client.translation.get(guildDb?.language, "Settings.button.autoPin"),
        )
        .setStyle(
          guildDb.autoPin ? ButtonStyle.Success : ButtonStyle.Secondary,
        ),
      new ButtonBuilder()
        .setCustomId("dailyMsg")
        .setEmoji("1185973660465500180")
        .setLabel(
          client.translation.get(guildDb?.language, "Settings.button.dailyMsg"),
        )
        .setStyle(
          guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary,
        ),
    );

  await interaction
    .reply({
      embeds: [emb],
      components: [dailyButtons1, dailyButtons2, dailyButtons3],
      ephemeral: true,
    })
    .catch((err) => {
      console.log(err);
    });
}
