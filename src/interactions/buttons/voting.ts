import { ButtonInteraction } from 'discord.js';

import { CoreButton } from '@typings/core';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'voting',
  description: 'voting shit',
  /**
   * @param interaction
   * @param client
   */
  async execute(interaction: ButtonInteraction, client: ExtendedClient) {
    const customId = interaction.customId.split('_');

    if (Number.isNaN(parseInt(customId[2], 10))) return;

    client.voting.addVote(customId[1], interaction.user.id, parseInt(customId[2], 10));

    interaction.reply({
      content: `You've successfully voted for ${
        client.voting.getVoting(customId[1])?.type === 0
          ? parseInt(customId[2], 10) === 0
            ? 'number one'
            : 'number two'
          : parseInt(customId[2], 10) === 0
          ? 'yes'
          : 'no'
      }.`,
      ephemeral: true,
    });
  },
};

export default button;
