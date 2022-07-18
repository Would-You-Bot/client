const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for me!'),

  async execute(interaction, client) {
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { Vote } = require(`../languages/${result.language}.json`);
        const votemebed = new EmbedBuilder()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
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
            {
              name: 'VoidBots',
              value: `> [ ${Vote.embed.value} ](https://voidbots.net/bot/981649513427111957/vote)`,
              inline: true,
            },
            {
              name: 'Botlist.me',
              value: `> [ ${Vote.embed.value}   ](https://botlist.me/bots/981649513427111957/vote)`,
              inline: true,
            },
            {
              name: 'Radar Bot Directory',
              value: `> [ ${Vote.embed.value}   ](https://radarbotdirectory.xyz/bot/981649513427111957/vote)`,
              inline: true,
            },
            {
              name: 'Infinity Bot List',
              value: `> [ ${Vote.embed.value}   ](https://infinitybots.gg/bots/981649513427111957/vote)`,
              inline: true,
            },
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setFooter({ text: `${Vote.embed.footer}` });

        await interaction.reply({
          embeds: [votemebed],
        });
      });
  },
};
