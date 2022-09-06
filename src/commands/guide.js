const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('guide to use the bot and increase activity'),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Guide } = require(`../languages/${result.language}.json`);

        const guideembed = new EmbedBuilder()
          .setColor('#0598F6')
          .setFooter({
            text: `${Guide.embed.footer}`,
            iconURL: client.user.avatarURL(),
          })
          .setTimestamp()
          .setTitle(`${Guide.embed.title}`)
          .addFields(
            {
              name: `${Guide.embed.name1}`,
              value: `${Guide.embed.value1}`,
              inline: false,
            },
            {
              name: `${Guide.embed.name2}`,
              value: `${Guide.embed.value2}`,
              inline: false,
            },
            {
              name: `${Guide.embed.name3}`,
              value: `${Guide.embed.value3}`,
              inline: false,
            },
          )
          .setImage('https://wouldyoubot.com/assets/guidembed.png')
          .setDescription(Guide.embed.description);

        await interaction.reply({
          embeds: [guideembed],
        }).catch((err) => { console.log(err); });
      });
  },
};
