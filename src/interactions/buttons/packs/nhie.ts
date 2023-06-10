import { CoreButton } from '@utils/builders';
import nhieInterface from 'src/interfaces/packs/nhie';

export default new CoreButton({
  id: 'nhie',
  description: 'Never have I ever.',
}).execute(async (client, interaction) => {
  const useInterface = await nhieInterface({ client, interaction });
  return interaction.reply(useInterface);
});
