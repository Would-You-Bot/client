const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "replayDelete",
    description: "Replay Delete",
  },
  async execute(interaction, client, guildDb) {
    const arr =
      guildDb.replayChannels.filter((c) => c.id !== interaction.values[0])
        .length > 0
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
                .filter((c) => c.id !== interaction.values[0])
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
        iconURL: client.user.avatarURL(),
      });

    const generalButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("replayChannels")
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

    guildDb.replayChannels = guildDb.replayChannels.filter(
      (c) => c.id !== interaction.values[0],
    );
    await client.database.updateGuild(interaction.guild.id, {
      replayChannels: guildDb.replayChannels,
    });

    return interaction.update({
      content: null,
      embeds: [generalMsg],
      components: [generalButtons, chanDelete],
      ephemeral: true,
    });
  },
};
