const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('howtoplay')
    .setDescription('Guide on how to play the game!'),

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Vote } = require(`../languages/${result.language}.json`);
        const howtoplayembed = new EmbedBuilder()
          .setColor('#5865f4')
          .setTitle(
            `${Vote.embed.title}`,
          )
          .addFields(
            {
              name: 'Top.gg',
              value: `> [ ${Vote.embed.value}  ](https://top.gg/bot/981649513427111957/vote)`,
              inline: true,
            },
            {
              name: 'Infinity Bot List',
              value: `> [ ${Vote.embed.value}  ](https://infinitybots.gg/bots/981649513427111957/vote)`,
              inline: true,
            },
          )
          .setFooter({ text: `${Vote.embed.footer}` });

        await interaction.reply({
          embeds: [howtoplayembed],
        });
      });
  },
};
