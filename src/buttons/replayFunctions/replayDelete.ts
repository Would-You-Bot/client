import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../interfaces";

const button: Button = {
  name: "replayDelete",
  execute: async (interaction, client, guildDb) => {
    const arr =
      guildDb.replayChannels.filter(
        (c) => c.id !== (interaction as any).values[0],
      ).length > 0
        ? guildDb.replayChannels
        : "None";

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
          "Settings.embed.replayChannels",
        )}: ${
          arr === "None"
            ? arr
            : `\n${arr
                .filter((c) => c.id !== (interaction as any).values[0])
                .map((c) => `<#${c.id}>: ${c.cooldown}`)
                .join("\n")}`
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

    let setDeleteButtons;
    if (guildDb.replayType === "Channels") {
      setDeleteButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(
              guildDb.replayType === "Channels"
                ? "replayChannels"
                : "replayCooldown",
            )
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
      setDeleteButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
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
        );
    }

    guildDb.replayChannels = guildDb.replayChannels.filter(
      (c) => c.id !== (interaction as any).values[0],
    );

    await client.database.updateGuild(interaction.guild?.id || "", {
      ...guildDb,
      replayChannels: guildDb.replayChannels,
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
