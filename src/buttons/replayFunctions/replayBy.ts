import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { Button } from "../../interfaces";

const button: Button = {
  name: "replayBy",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const newType = guildDb.replayBy === "Guild" ? "User" : "Guild";
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
        )}: ${newType}\n${
          newType === "Guild"
            ? client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy2",
              )
            : client.translation.get(
                guildDb?.language,
                "Settings.embed.replayBy1",
              )
        }\n${
          guildDb.replayType === "Guild"
            ? `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayCooldown",
              )}: ${guildDb.replayCooldown / 1000}s`
            : `${client.translation.get(guildDb?.language, "Settings.embed.replayChannels")}: ${
                guildDb.replayChannels.length > 0
                  ? `\n${guildDb.replayChannels
                      .sort(
                        (a: any, b: any) =>
                          b.cooldown / 1000 - a.cooldown / 1000,
                      )
                      .map((c) => `<#${c.id}>: ${Number(c.cooldown) / 1000}s`)
                      .join("\n")}`
                  : client.translation.get(
                      guildDb?.language,
                      "Settings.embed.replayChannelsNone",
                    )
              }`
        }`,
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
      new ActionRowBuilder<MessageActionRowComponentBuilder>();
    if (guildDb.replayType === "Channels") {
      setDeleteButtons.addComponents(
        new ButtonBuilder()
          .setCustomId("replayChannels")
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
        new ButtonBuilder()
          .setCustomId("replayDeleteChannels")
          .setEmoji("1207774452230787182")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayDeleteChannels",
            ),
          )
          .setStyle(ButtonStyle.Danger),
      );
    } else {
      setDeleteButtons.addComponents(
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
    }

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      replayBy: newType,
    });

    interaction.update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, setDeleteButtons],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
