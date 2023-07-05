import { ordinalNumber } from '@slekup/utils';

import { UserChoicesModel } from '@models/UserChoices';
import { CoreButton } from '@utils/builders';

const button = new CoreButton({
  id: 'choice',
  description: "Set a user's choice",
}).execute(async (client, interaction, args) => {
  if (!args) return;

  const [custom, packId, questionId, choice] = args;

  if (Number.isNaN(parseInt(choice, 10))) throw new Error('Invalid choice');

  const query = UserChoicesModel.findOneAndUpdate(
    {
      packId,
      questionId,
      custom: custom === '1',
    },
    {
      $push: {
        [`choices.$[${custom === '1' ? 'first' : 'second'}]`]:
          interaction.user.id,
      },
    }
  );

  await query.exec();

  interaction.reply({
    content: `You've successfully voted for the ${ordinalNumber(
      parseInt(choice, 10)
    )} option.`,
    ephemeral: true,
  });
});

export default button;
