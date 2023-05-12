import { GuildProfileDocument } from '@models/guildProfile.model';
import { CoreButton } from '@typings/core';
import { ButtonInteraction } from 'discord.js';
import { ExtendedClient } from 'src/client';

const button: CoreButton = {
  name: 'voting',
  description: 'voting shit',
  async execute(
    interaction: ButtonInteraction,
    client: ExtendedClient,
    guildDb: GuildProfileDocument
  ) {
    const customId = interaction.customId.split('_');

    if (isNaN(parseInt(customId[2]))) return;

    client.voting.addVote(
      customId[1],
      interaction.user.id,
      parseInt(customId[2])
    );

    interaction.reply({
      content: `You've successfully voted for ${
        client.voting.getVoting(customId[1])?.type == 0
          ? parseInt(customId[2]) == 0
            ? 'number one'
            : 'number two'
          : parseInt(customId[2]) == 0
          ? 'yes'
          : 'no'
      }.`,
      ephemeral: true,
    });
  },
};

export default button;
