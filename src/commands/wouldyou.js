const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wouldyou')
    .setDescription('Would you')
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Useless superpower'))
    .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Useful superpower')),

  async execute(interaction, client) {
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou } = await require(`../languages/${result.language}.json`);
        const {
          Useless_Superpowers,
          Useful_Superpowers,
        } = await require(`../data/superpower-${result.language}.json`);

        switch (interaction.options.getSubcommand()) {
          case 'useful': {
            wouldyouembed = new EmbedBuilder()
              .setColor('#0598F6')
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })
              .addFields({
                name: WouldYou.embed.Usefulname,
                value: `> ${
                  Useful_Superpowers[
                    Math.floor(Math.random() * (Useful_Superpowers.length + 1))
                  ]
                }`,
                inline: false,
              });
            break;
          }
          case 'useless': {
            wouldyouembed = new EmbedBuilder()
              .setColor('#F00505')
              .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Uselessname,
                value: `> ${
                  Useless_Superpowers[
                    Math.floor(Math.random() * (Useless_Superpowers.length + 1))
                  ]
                }`,
                inline: false,
              });
          }
        }
        const message = await interaction.reply({ embeds: [wouldyouembed], fetchReply: true })
        try {
        await message.react('✅');
        await message.react('❌');
        } catch (error) {
          return;
        }
     });
  },
};
