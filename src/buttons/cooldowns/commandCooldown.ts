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
  name: "commandCooldown",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const { data } = await new Modal({
      title: "Command Cooldown",
      customId: "commandCooldown",
      fields: [
        {
          customId: "input",
          style: "line",
          label: "Provide a command cooldown in seconds",
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
          "Settings.commandSame"
        ),
      });
      return;
    }

    if (isNumericRegex(value!) === false) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.cooldownInvalid"
        ),
      });
      return;
    }

    if (Number(value) < 2) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayCooldownMin"
        ),
      });
      return;
    }

    if (Number(value) > 21600) {
      data?.modal.reply({
        ephemeral: true,
        content: client.translation.get(
          guildDb?.language,
          "Settings.cooldownTooLong"
        ),
      });
      return;
    }

    const generalMsg = new EmbedBuilder()
      .setTitle(
        client.translation.get(guildDb?.language, "Settings.embed.generalTitle")
      )
      .setDescription(
        `${client.translation.get(
          guildDb?.language,
          "Settings.embed.commandType"
        )}: ${guildDb.commandType}\n${
          guildDb.commandBy === "Command"
            ? client.translation.get(
                guildDb?.language,
                "Settings.embed.commandType1"
              )
            : client.translation.get(
                guildDb?.language,
                "Settings.embed.commandType2"
              )
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.commandBy"
        )}: ${guildDb.commandBy}\n${
          guildDb.commandBy === "Guild"
            ? client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy2"
              )
            : client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy1"
              )
        }\n${client.translation.get(
          guildDb?.language,
          "Settings.embed.command"
        )}: ${value}s`
      )
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(
          guildDb?.language,
          "Settings.embed.footer"
        ),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    const generalButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId("commandType")
          .setEmoji("1207774450658050069")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.commandType"
            )
          ),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId("commandBy")
          .setEmoji("1207774450658050069")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.commandBy"
            )
          )
      );

    const setCommandCooldownButton =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("commandCooldown")
          .setEmoji("1185973661736374405")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.commandCooldown"
            )
          )
          .setStyle(
            guildDb.commandCooldown
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
      );

    const goTo =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("cooldownButtons")
          .setLabel(
            client.translation.get(guildDb?.language, "Settings.button.goToA")
          )
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("1308672399188820023")
      );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      commandCooldown: value * 1000,
    });

    await (data?.modal as any).update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, setCommandCooldownButton, goTo],
    });
    return;
  },
};

export default button;
