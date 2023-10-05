const {
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "dailyChannel",
    description: "Daily Channel",
  },
  async execute(interaction, client, guildDb) {
    const inter = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("selectMenuChannel")
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
