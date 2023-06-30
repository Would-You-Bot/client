import { EmbedBuilder } from 'discord.js';

import { UserChoicesModel } from '@models/UserChoices';
import { stripIndents } from '@slekup/utils';
import { CoreButton } from '@utils/builders';

export default new CoreButton({
  id: 'results',
  description: 'The user choice results',
}).execute(async (client, interaction, args) => {
  if (!args) return;

  const [custom, packId, questionId] = args;

  const query = UserChoicesModel.findOne({
    packId,
    questionId,
    custom: custom === '1',
  });

  query.select({
    firstLength: { $size: '$choices.first' },
    secondLength: { $size: '$choices.second' },
  });

  const results = await query.exec();

  if (!results) {
    return interaction.reply({
      content: 'No results found',
      ephemeral: true,
    });
  }

  const { firstLength, secondLength } = results.toObject() as {
    firstLength: number;
    secondLength: number;
  };

  const embed = new EmbedBuilder().setTitle('Results (Text)').setDescription(
    stripIndents(`
      **First Option:** ${firstLength}
      **Second Option:** ${secondLength}
    `)
  );

  interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
});
