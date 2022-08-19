const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Link to our support server'),
        
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */


  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Support } = require(`../languages/${result.language}.json`);

        const supportembed = new EmbedBuilder()
         .setColor('#F00505')
         .setTitle(Support.embed.title)
         .setDescription(`${Support.embed.description}`)
         .setFooter({ text: `${Support.embed.footer}` })
         .setTimestamp()


        const supportbutton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel('Support Server')
              .setStyle(5)
              .setEmoji('💻')
              .setURL('https://discord.gg/vMyXAxEznS'),
          );

        await interaction.reply({ embeds: [supportembed], components: [supportbutton] });
      });
  },
};
