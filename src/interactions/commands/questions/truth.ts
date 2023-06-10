import { SlashCommandBuilder } from 'discord.js';

import CoreCommand from '@utils/builders/CoreCommand';

export default new CoreCommand({
  data: new SlashCommandBuilder()
    .setName('truth')
    .setDescription('Shows information about the bot.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      'de': 'Zeigt einige Informationen über den Bot.',
      'es-ES': 'Muestra información sobre el bot.',
    }),
}).execute((client, interaction) => {
  // ! temp if statement to prevent eslint warning
  if (!interaction.guild || !client.user) return null;
});
