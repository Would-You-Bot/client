import { CoreButton } from '@utils/builders';
import wwydInterface from 'src/interfaces/packs/wwyd';

export default new CoreButton({
  id: 'wwyd',
  description: 'What would you do',
}).execute(async (client, interaction) => {
  const useInterface = await wwydInterface({ client, interaction });

  return interaction.reply(useInterface).catch(client.logger.error);
});
