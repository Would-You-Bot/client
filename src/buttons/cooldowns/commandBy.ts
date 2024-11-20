import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "commandBy",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const newType = guildDb.commandBy === "Guild" ? "User" : "Guild";
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
        )}: ${newType}\n${
          newType === "Guild"
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
        )}: ${guildDb.commandCooldown / 1000}s`
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
      commandBy: newType,
    });

    interaction.update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, setCommandCooldownButton, goTo],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
