module.exports = {
  data: {
    name: "voting",
    description: "voting shit",
  },
  async execute(interaction, client, guildDb) {
    const customId = interaction.customId.split("_");

    client.voting.addVote(customId[1], interaction.user.id, customId[2]);

    interaction.reply({
      content: `You've successfully voted for ${
        client.voting.getVoting(customId[1])?.type == 0
          ? customId[2] == 0
            ? "number one"
            : "number two"
          : customId[2] == 0
          ? "yes"
          : "no"
      }.`,
      ephemeral: true,
    });
  },
};
