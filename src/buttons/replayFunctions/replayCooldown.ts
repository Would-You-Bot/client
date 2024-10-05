import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";
import { Modal, type ModalData } from "../../util/modalHandler";

function isNumericRegex(str: string) {
  return /^\d*\.?\d+$/.test(str); // regex for extra 0,00000002% speeds :trol:
}

const button: Button = {
  name: "replayCooldown",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Replay Cooldown",
      customId: "replayCooldown",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "Provide a replay cooldown in seconds",
          required: true,
          placeholder: "20",
        },
      ],
    } as ModalData).getData(interaction);

    const value = data?.fieldValues[0].value as any;

    if (guildDb.replayCooldown.toString() === value) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.replaySame",
        ),
      });
      return;
    }

    if (isNumericRegex(value!) === false) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.cooldownInvalid",
        ),
      });
      return;
    }

    if (Number(value) < 2) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayCooldownMin",
        ),
      });
      return;
    }

    if (Number(value) > 21600) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.cooldownTooLong",
        ),
      });
      return;
    }

    const generalMsg = new EmbedBuilder()
      .setTitle(
        client.translation.get(
          guildDb?.language,
          "Settings.embed.generalTitle",
        ),
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.replayType",
        )}: ${guildDb.replayType}\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.replayBy",
        )}: ${guildDb.replayBy}\n${
          guildDb.replayBy === "Guild"
            ? client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy2",
              )
            : client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy1",
              )
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.replayCooldown",
        )}: ${guildDb.replayCooldown ? `${value}s` : ":x:"}\n`,
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer",
        ),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const generalButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("replayType")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayType",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("1207774450658050069"),
        new ButtonBuilder()
          .setCustomId("replayBy")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayBy",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("1207778786976989244"),
      );

    const setDeleteButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("replayCooldown")
          .setEmoji("1185973661736374405")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayCooldown",
            ),
          )
          .setStyle(
            guildDb.replayCooldown
              ? ButtonStyle.Success
              : ButtonStyle.Secondary,
          ),
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      replayCooldown: value * 1000,
    });

    await (data?.modal as any).update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, setDeleteButtons],
    });
    return;
  },
};

export default button;
