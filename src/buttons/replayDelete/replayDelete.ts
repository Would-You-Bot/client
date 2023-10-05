import {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Button } from "../../models";

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
        )}: ${guildDb.replayType}\n ${client.translation.get(
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
        iconURL: client.user?.avatarURL() || undefined,
      });

    const generalButtons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("replayChannels")
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
          .setCustomId("replayType")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayType",
            ),
          )
          .setStyle(ButtonStyle.Primary)
          .setEmoji("📝"),
      );

    const chanDelete =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("replayDeleteChannels")
          .setLabel(
            client.translation.get(
              guildDb?.language,
              "Settings.button.replayDeleteChannels",
            ),
          )
          .setStyle(ButtonStyle.Danger),
      );

    guildDb.replayChannels = guildDb.replayChannels.filter(
      (c) => c.id !== (interaction as any).values[0],
    );
    await client.database.updateGuild(interaction.guild?.id || "", {
      replayChannels: guildDb.replayChannels,
    });

    interaction.update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, chanDelete],
      options: {
        ephemeral: true,
      },
    });
    return;
  },
};

export default button;
