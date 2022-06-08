const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wouldyou')
    .setDescription('Would you ?!')
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Useless superpower'))
    .addSubcommand((subcommand) => subcommand.setName('usefull').setDescription('Usefull superpower')),

  async execute(interaction, client) {
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou } = require(`../languages/${result.language}.json`);
        const {
          Useless_Superpowers,
          Usefull_Superpowers,
        } = require(`../data/superpower-${result.language}.json`);

        switch (interaction.options.getSubcommand()) {
          case 'usefull': {
            wouldyouembed = new MessageEmbed()
              .setColor('#0598F6')
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })
              .addFields({
                name: WouldYou.embed.usefullname,
                value: `${
                  Usefull_Superpowers[
                    Math.floor(Math.random() * (Usefull_Superpowers.length + 1))
                  ]
                }`,
                inline: false,
              });
            break;
          }
          case 'useless': {
            wouldyouembed = new MessageEmbed()
              .setColor('#F00505')
              .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })
              .setFooter({ text: `${WouldYou.embed.footer}` })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.uselessname,
                value: `${
                  Useless_Superpowers[
                    Math.floor(Math.random() * (Useless_Superpowers.length + 1))
                  ]
                }`,
                inline: false,
              });
          }
        }
        await interaction.reply({
          embeds: [wouldyouembed],
        });
      });
  },
};
