import { ButtonInteraction, EmbedBuilder } from 'discord.js';

import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'result',
  description: 'The voting result',
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const customId = interaction.customId.split('_');

    const votingResults = await client.voting.getVotingResults(customId[1]);

    if (!votingResults)
      return interaction.reply({
        content: 'No results found',
        ephemeral: true,
      });

    const resultEmbed = new EmbedBuilder().setImage(votingResults.chart);

    interaction.reply({
      embeds: [resultEmbed],
      ephemeral: true,
    });
  },
};

export default button;
