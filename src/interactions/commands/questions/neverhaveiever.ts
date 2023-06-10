import { SlashCommandBuilder } from 'discord.js';

import CoreCommand from '@utils/builders/CoreCommand';
import nhieInterface from 'src/interfaces/packs/nhie';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('neverhaveiever')
    .setDescription('Get a never have I ever message.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Bekomme eine nie habe ich jemals Nachricht.',
      'es-ES': 'Consigue un mensaje Nunca he tenido',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const useInterface = await nhieInterface({ client, interaction });

  interaction.reply(useInterface);
});
