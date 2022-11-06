const { EmbedBuilder } = require('discord.js');
require('dotenv').config();
const guildProfile = require('../util/Models/guildModel');

module.exports = async (client, member) => {
  await guildProfile.findOne({ guildID: member.guild.id, welcome: true }).then(async (result) => {
    if (!result) {
      return;
    }

    const channel = member.guild.channels.cache.get(result.welcomeChannel);

    const { Welcome } = await require(`../languages/${result.language}.json`);
    const { Useful_Powers } = await require(`../data/power-${result.language}.json`);

    let power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];

    const wouldyouembed = new EmbedBuilder()
      .setColor('#0598F6')
      .setFooter({
        text: `${member.user.username} ${Welcome.embed.footer}`,
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp()
      .addFields({
        name: Welcome.embed.title,
        value: `> ${power}`,
        inline: false,
      });
    if (member.user.bot == false) {
      await channel.send({ embeds: [wouldyouembed] }).catch((err) => { return; });
    } else { return; }
  });
};
