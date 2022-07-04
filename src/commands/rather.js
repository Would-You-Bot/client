const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildLang = require('../util/Models/guildModel.ts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rather')
    .setDescription('Get a would you rather question.')
    .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Get a useful would you rather'))
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Get a useless would you rather')),

  async execute(interaction) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Rather } = await require(`../languages/${result.language}.json`);
        const {
          Useless_Superpowers,
          Useful_Superpowers,
        } = await require(`../data/superpower-${result.language}.json`);
        let ratherEmebed;

        switch (interaction.options.getSubcommand()) {
          case 'useful': {
            ratherEmebed = new MessageEmbed()
              .setColor('#0598F6')
              .addFields(
                {
                  name: Rather.embed.usefulname,
                  value: Useful_Superpowers[
                    Math.floor(Math.random() * (Useful_Superpowers.length + 1))
                  ],
                  inline: false,
                },
              )
              .addFields(
                {
                  name: Rather.embed.usefulname2,
                  value: Useful_Superpowers[
                    Math.floor(Math.random() * (Useful_Superpowers.length + 1))
                  ],
                  inline: false,
                },
              )
              .setFooter({ text: `${Rather.embed.footer}` })
              .setTimestamp();
            break;
          }
          case 'useless': {
            ratherEmebed = new MessageEmbed()
              .setColor('#F00505')
              .addFields(
                {
                  name: Rather.embed.uselessname,
                  value: Useless_Superpowers[
                    Math.floor(Math.random() * (Useless_Superpowers.length + 1))
                  ],
                  inline: false,
                },
              )
              .addFields(
                {
                  name: Rather.embed.uselessname2,
                  value: Useless_Superpowers[
                    Math.floor(Math.random() * (Useless_Superpowers.length + 1))
                  ],
                  inline: false,
                },
              )
              .setFooter({ text: `${Rather.embed.footer}` })
              .setTimestamp();
            break;
          }
        }
        await interaction.reply({
          embeds: [ratherEmebed],
        });
      });
  },
};
