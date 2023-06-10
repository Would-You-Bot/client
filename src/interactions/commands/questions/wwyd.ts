import { SlashCommandBuilder } from 'discord.js';

import CoreCommand from '@utils/builders/CoreCommand';
import wwydInterface from 'src/interfaces/packs/wwyd';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('wwyd')
    .setDescription('What would you do in this situation')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Was würdest du in dieser Situation tun',
      'es-ES': '¿Qué harías en esta situación?',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const useInterface = await wwydInterface({ client, interaction });

  interaction.reply(useInterface);
});
