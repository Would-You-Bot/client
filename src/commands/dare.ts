const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dare')
    .setDescription('Shows information about the bot.')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Zeigt einige Informationen über den Bot.',
      "es-ES": 'Muestra información sobre el bot.'
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
   
  },
};
