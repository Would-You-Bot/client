const {
  EmbedBuilder,
  ActionRowBuilder,
  ChannelType,
  ChannelSelectMenuBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "result",
    description: "The voting result",
  },
  async execute(interaction, client, guildDb) {
    const customId = interaction.customId.split("_");

    const votingResults = await client.voting.getVotingResults(customId[1]);

    const resultEmbed = new EmbedBuilder().setImage(votingResults.chart);

    interaction.reply({
      embeds: [resultEmbed],
      ephemeral: true,
    });
  },
};
