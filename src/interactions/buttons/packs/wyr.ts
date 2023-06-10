import { CoreButton } from '@utils/builders';
import wyrInterface from 'src/interfaces/packs/wyr';

export default new CoreButton({
  id: 'wyr',
  description: 'would you rather',
}).execute(async (client, interaction) => {
  const useInterface = await wyrInterface({ client, interaction });

  return interaction.reply(useInterface).catch(client.logger.error);
});
