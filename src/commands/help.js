const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command!'),
    
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Help } = require(`../languages/${result.language}.json`);

        const helpembed = new EmbedBuilder()
          .setColor('#0598F6')
          .setFooter({ text: `${Help.embed.footer}` })
          .setTimestamp()
          .setTitle(Help.embed.title)
          .addFields(
            {
              name: Help.embed.Fields.name,
              value: Help.embed.Fields.value,
            },
          )
          .setDescription(Help.embed.description);

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(Help.button.title)
            .setStyle(5)
            .setEmoji('💫')
            .setURL('https://discord.developersdungeon.xyz'),
          new ButtonBuilder()
            .setLabel('Source code')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL('https://github.com/Developer-Dungeon-Studio/Would-You'),
        );

        await interaction.reply({
          embeds: [helpembed],
          components: [button],
        });
      });
  },
};
