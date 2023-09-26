module.exports = {
  data: {
    name: "voting",
    description: "voting shit",
  },
  async execute(interaction, client, guildDb) {
    const customId = interaction.customId.split("_");

    client.voting.addVote(customId[1], interaction.user.id, customId[3]);

    interaction.reply({
      content: `You've successfully voted for ${
        customId[2] === "wouldyourather"
          ? customId[3] == 0 || customId[2] == 0
            ? "number one"
            : "number two"
          : customId[3] == 0 || customId[2] == 0
          ? "yes"
          : "no"
      }.`,
      ephemeral: true,
    });
  },
};
