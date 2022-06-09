const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rather')
    .setDescription('Displays the clients ping')
    .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Set the language to german'))
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Set the language to german')),

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Rather } = require(`../languages/${result.language}.json`);
        let ratherEmebed;
        switch (interaction.options.getSubcommand()) {
          case 'useful': {
            ratherEmebed = new MessageEmbed()

              .setColor('#0598F6')
              .setAuthor({
                name: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })
              .setFooter({ text: `${Rather.embed.footer}` })
              .setTimestamp()
              .setTitle(Rather.embed.title)
              .addFields(
                {
                  name: Rather.embed.client,
                  value: `> **${Math.abs(
                    Date.now() - interaction.createdTimestamp,
                  )}**ms`,
                  inline: false,
                },
                {
                  name: Rather.embed.api,
                  value: `> **${Math.round(client.ws.ping)}**ms`,
                  inline: false,
                },
              );
          }
        }
        const button = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel(Rather.button.title)
            .setStyle('LINK')
            .setEmoji('💻')
            .setURL('https://discordstatus.com/'),
        );
        await interaction.reply({
          embeds: [ratherEmebed],
          components: [button],
        });
        setTimeout(() => {
          button.components[0].setDisabled(true);
          interaction.editReply({
            embeds: [ratherEmebed],
            components: [button],
          });
        }, 120000);
      });
  },
};
