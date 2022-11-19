const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for me!')
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: 'Stimme für mich ab!',
      "es-ES": '¡Vota por mí!'
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Vote } = require(`../languages/${result.language}.json`);
        const votemebed = new EmbedBuilder()
          .setColor('#5865f4')
          .setTitle(`${Vote.embed.title}`)
          .addFields(
            {
              name: 'Top.gg',
              value: `> [ ${Vote.embed.value}  ](https://top.gg/bot/981649513427111957/vote)`,
              inline: true,
            },
            {
              name: 'Discord Bot List',
              value: `> [ ${Vote.embed.value}  ](https://discordbotlist.com/bots/would-you-8427/upvote)`,
              inline: true,
            },
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({
            text: `${Vote.embed.footer}`,
            iconURL: client.user.avatarURL(),
          });
        await interaction.reply({
          embeds: [votemebed],
        }).catch((err) => { return; });
      });
  },
};
