import { SlashCommandBuilder } from 'discord.js';

import CoreCommand from '@utils/builders/CoreCommand';
import wyrInterface from 'src/interfaces/packs/wyr';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('wouldyourather')
    .setDescription('Get a would you rather question.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Erhalte eine Würdest du eher Frage.',
      'es-ES': 'Obtiene une pregunta ¿Qué prefieres?',
    }),
}).execute(async (client, interaction) => {
  if (!interaction.guildId) return;

  const useInterface = await wyrInterface({ client, interaction });

  interaction.reply(useInterface);
});
