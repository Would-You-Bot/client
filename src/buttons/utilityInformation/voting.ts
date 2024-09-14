import type { Button } from "../../interfaces";

const button: Button = {
  name: "voting",
  cooldown: false,
  execute: async (interaction, client, guildDb) => {
    const customId = interaction.customId.split("_") as any;

    client.voting.addVote(customId[1], interaction.user.id, customId[3]);

    const vote = await client.voting.getRawVotingResults(customId[1]);

    const option1Votes = vote ? vote.option_1 || 0 : 0;
    const option2Votes = vote ? vote.option_2 || 0 : 0;
    const totalVotes = vote ? vote.all_votes || 0 : 0;

    const optionChosen =
      customId[2] === "wouldyourather"
        ? customId[3] === 0 || customId[2] === 0
          ? "Option 1"
          : "Option 2"
        : customId[3] === 0 || customId[2] === 0
          ? "have done this"
          : "have not done this";

    let replyContent = `You've voted for **${optionChosen}**.`;

    if (optionChosen === "Option 1") {
      replyContent += ` **Option 1** got ${option1Votes} votes (${((option1Votes / totalVotes) * 100) | 0}%) and **Option 2** got ${option2Votes} votes (${(option2Votes / totalVotes) * 100}%).`;
    } else if (optionChosen === "Option 2") {
      replyContent += ` **Option 2** got ${option2Votes} votes (${((option2Votes / totalVotes) * 100) | 0}%) and **Option 1** got ${option1Votes} votes (${(option1Votes / totalVotes) * 100}%).`;
    } else {
      replyContent;
    }

    interaction.reply({
      content: replyContent,
      ephemeral: true,
    });
  },
};

export default button;
