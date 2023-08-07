const {
  ActionRowBuilder,
  ChannelType,
  StringSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "replayDeleteChannels",
    description: "Replay Channels",
  },
  async execute(interaction, client, guildDb) {
    if (guildDb.replayChannels.length <= 0)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "Settings.replayChannelNone",
        ),
        ephemeral: true,
      });
    const inter = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("replayDelete")
        .setPlaceholder("Select a channel to remove cooldown from")
        .addOptions(
          guildDb.replayChannels.map((channel) => {
            return {
              label: channel.name,
              value: channel.id,
            };
          }),
        ),
    );

    interaction.update({
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
