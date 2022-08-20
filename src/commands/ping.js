const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Displays the clients ping'),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Ping } = require(`../languages/${result.language}.json`);

        const pingembed = new EmbedBuilder()

          .setColor('#0598F6')
          .setFooter({
            text: `${Ping.embed.footer}`,
            iconURL: client.user.avatarURL(),
          })
          .setTimestamp()
          .setTitle(Ping.embed.title)
          .addFields(
            {
              name: Ping.embed.client,
              value: `> **${Math.abs(
                Date.now() - interaction.createdTimestamp,
              )}**ms`,
              inline: false,
            },
            {
              name: Ping.embed.api,
              value: `> **${Math.round(client.ws.ping)}**ms`,
              inline: false,
            },
          );
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel(Ping.button.title)
            .setStyle(5)
            .setEmoji('💻')
            .setURL('https://discordstatus.com/'),
        );
        try {
          await interaction.reply({
            embeds: [pingembed],
            components: [button],
          });
          setTimeout(() => {
            button.components[0].setDisabled(true);
            interaction.editReply({
              embeds: [pingembed],
              components: [button],
            });
          }, 120000);
        } catch (error) {
          console.error(error);
        }
      });
  },
};
