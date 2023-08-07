const {
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "welcomeChannel",
    description: "Daily Channel",
  },
  async execute(interaction, client, guildDb) {
    const inter = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("seletcMenuWelcome")
        .setPlaceholder("Select a channel")
        .addChannelTypes(ChannelType.GuildText),
    );

    interaction.update({
      content: null,
      embeds: [],
      content: client.translation.get(
        guildDb?.language,
        "Settings.dailyChannel",
      ),
      components: [inter],
      ephemeral: true,
    });
  },
};
