const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wwyd')
    .setDescription('What would you do...'),
        
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */


  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Wwyd } = require(`../languages/${result.language}.json`);

        const { WhatYouDo } = require(`../data/wwyd-${result.language}.json`);

        let 
        wwydstring = WhatYouDo[
          Math.floor(Math.random() * WhatYouDo.length)
        ]

            let wwydembed = new EmbedBuilder()

            .setColor('#0598F6')
            .setFooter({ text: `${Wwyd.embed.footer}` })
            .setTimestamp()
            .setTitle(Wwyd.embed.title)
            .setDescription("> " + wwydstring)

        await interaction.reply({ embeds: [wwydembed] });


      });
  },
};
