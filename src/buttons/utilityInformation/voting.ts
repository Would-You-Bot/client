import { Button } from "../../interfaces";

const button: Button = {
  name: "voting",
  execute: async (interaction, client, guildDb) => {
    const customId = interaction.customId.split("_") as any;

    client.voting.addVote(customId[1], interaction.user.id, customId[3]);

    interaction.reply({
      content: `You've successfully voted for ${
        customId[2] === "wouldyourather"
          ? customId[3] == 0 || customId[2] == 0
            ? "Option 1"
            : "Option 2"
          : customId[3] == 0 || customId[2] == 0
            ? '"have done this"'
            : '"have not done this"'
      }.`,
      ephemeral: true,
    });
  },
};

export default button;
