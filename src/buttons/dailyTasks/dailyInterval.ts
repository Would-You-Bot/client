import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

function isFormat(str: string) {
  return /^(?:[01]\d|2[0-4]):(?:00|05|10|15|20|25|30|35|40|45|50|55)$/.test(
    str
  );
}

const button: Button = {
  name: "dailyInterval",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Daily Post Time",
      customId: "dailyInterval",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "When should the message be posted? (HH:MM)",
          required: true,
          placeholder: guildDb.dailyInterval,
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value;

    if (guildDb.dailyInterval === value) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.intervalSame"
        ),
      });
      return;
    }
    if (isFormat(value!) === false) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.intervalInvalid"
        ),
      });
      return;
    }
    const dailyMsgs = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, "Settings.embed.dailyTitle")
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.dailyChannel"
        )}: ${guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyRole"
          )}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : ":x:"}\n` +
          `${client.translation.get(guildDb?.language, "Settings.embed.dailyType")}: ${guildDb?.customTypes}\n` +
          `${client.translation.get(guildDb?.language, "Settings.embed.dailyTimezone")}: ${guildDb.dailyTimezone}\n` +
          `${client.translation.get(guildDb?.language, "Settings.embed.dailyInterval")}: ${value}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyThread"
          )}: ${guildDb.dailyThread ? ":white_check_mark:" : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.autoPin"
          )}: ${guildDb.autoPin ? ":white_check_mark:" : ":x:"}\n` +
          `${client.translation.get(
            guildDb?.language,
            "Settings.embed.dailyMsg"
          )}: ${guildDb.dailyMsg ? ":white_check_mark:" : ":x:"}`
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
              "Settings.button.dailyChannel"
            )
          )
          .setStyle(
            guildDb.dailyChannel ? ButtonStyle.Primary : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("dailyRole")
          .setEmoji("1185973666811478117")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyRole"
            )
          )
          .setStyle(
            guildDb.dailyRole ? ButtonStyle.Primary : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("dailyType")
          .setEmoji("1185973664538177557")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyType"
            )
          )
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("dailyQuestionType")
          .setEmoji("1185973664538177557")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyQuestionType"
            )
          )
          .setStyle(ButtonStyle.Primary)
      );
    const dailyButtons2 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyTimezone")
          .setEmoji("1185973663674150912")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyTimezone"
            )
          )
          .setStyle(
            guildDb.dailyTimezone ? ButtonStyle.Success : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("dailyInterval")
          .setEmoji("1185973661736374405")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyInterval"
            )
          )
          .setStyle(
            guildDb.dailyInterval ? ButtonStyle.Success : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("daySelection")
          .setEmoji("1220826970133368842")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.daySelect"
            )
          )
          .setStyle(ButtonStyle.Success)
      );
    const dailyButtons3 =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("dailyThread")
          .setEmoji("1185973669059633304")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyThread"
            )
          )
          .setStyle(
            guildDb.dailyThread ? ButtonStyle.Success : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("autoPin")
          .setEmoji("1189521962318450698")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.autoPin")
          )
          .setStyle(
            guildDb.autoPin ? ButtonStyle.Success : ButtonStyle.Secondary
          ),
        new ButtonBuilder()
          .setCustomId("dailyMsg")
          .setEmoji("1185973660465500180")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.dailyMsg"
            )
          )
          .setStyle(
            guildDb.dailyMsg ? ButtonStyle.Success : ButtonStyle.Secondary
          )
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      dailyInterval: value,
    });

    await (data?.modal as any).update({
      content: null,
      embeds: [dailyMsgs],
      components: [dailyButtons, dailyButtons2, dailyButtons3],
    });
  },
};

export default button;
