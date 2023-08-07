const {
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "replayChannels",
    description: "Replay Channels",
  },
  async execute(interaction, client, guildDb) {
    if (guildDb.replayChannels.length >= 15)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelLimit",
        ),
        ephemeral: true,
      });

    const inter = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("selectMenuReplay")
        .setPlaceholder("Select a channel")
        .addChannelTypes(ChannelType.GuildText),
    );

    interaction.update({
      content: null,
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.replayChannel",
      ),
      components: [inter],
      ephemeral: true,
    });
  },
};
