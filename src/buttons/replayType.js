const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "replayType",
    description: "Replay type",
  },
  async execute(interaction, client, guildDb) {
    const newType = guildDb.replayType === "Channels" ? "Guild" : "Channels";
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
        )}: ${newType}\n${
          guildDb.replayType === "Channels"
            ? `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayCooldown",
              )}: ${guildDb.replayCooldown}`
            : `${client.translation.get(
                guildDb?.language,
                "Settings.embed.replayChannels",
              )}: ${
                guildDb.replayChannels.length > 0
                  ? `\n${guildDb.replayChannels
                      .map((c) => `<#${c.id}>: ${c.cooldown}`)
                      .join("\n")}`
                  : client.translation.get(
                      guildDb?.language,
                      `Settings.embed.replayChannelsNone`,
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
        iconURL: client.user.avatarURL(),
      });

    const generalButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(
          guildDb.replayType === "Channels"
            ? "replayCooldown"
            : "replayChannels",
        )
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.replayCooldown",
          ),
        )
        .setStyle(guildDb.replayCooldown ? "Success" : "Secondary"),
      new ButtonBuilder()
        .setCustomId("replayType")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.replayType",
          ),
        )
        .setStyle("Primary")
        .setEmoji("📝"),
    );

    const chanDelete = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("replayDeleteChannels")
        .setLabel(
          client.translation.get(
            guildDb?.language,
            "Settings.button.replayDeleteChannels",
          ),
        )
        .setStyle("Danger"),
    );

    await client.database.updateGuild(interaction.guild.id, {
      replayType: newType,
    });

    return interaction.update({
      content: null,
      embeds: [generalMsg],
      components:
        newType === "Channels"
          ? [generalButtons, chanDelete]
          : [generalButtons],
      ephemeral: true,
    });
  },
};
