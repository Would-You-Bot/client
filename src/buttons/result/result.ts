import { EmbedBuilder } from "discord.js";
import { Button } from "../../models";

const button: Button = {
  name: "result",
  execute: async(interaction, client, guildDb) => {
    const customId = interaction.customId.split("_");

    const votingResults = await client.voting.getVotingResults(customId[1]);
    if (!votingResults){
      await interaction.reply({
        content: "Unable to fetch results.",
        ephemeral: true,
      });
      return;
    }

    const resultEmbed = new EmbedBuilder()
      .setImage(votingResults.chart)
      .setColor(
        votingResults.option_1 < votingResults.option_2 ? "#0091ff" : "#f00404",
      );

    interaction.reply({
      embeds: [resultEmbed],
      ephemeral: true,
    });
  },
};

export default button;