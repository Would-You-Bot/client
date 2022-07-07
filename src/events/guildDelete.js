const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = async (client, guild) => {
  const channel = client.channels.cache.get(config.logs);
  let own = await guild.fetchOwner();
  const embed = new MessageEmbed()
    .setThumbnail(guild.iconURL({ format: 'webp', dynamic: true, size: 1024 }))
    .setTitle('Left a Guild !!')
    .addField('Name: ', `${guild.name}`)
    .addField('ID:', ` ${guild.id}`)
    .addField('Owner: ', ` ${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : 'Unknown user'} ${own.id} `)
    .addField('Member Count:', ` ${guild.memberCount} Members`)
    .addField('Left:', ` <t:${(Date.now() / 1000) | 0}:R>`)
    .setColor('#ff0000')
    .addField(`${client.user.username}'s Server Count:`, `\`${client.guilds.cache.size}\` Severs`);

  await channel.send({ embeds: [embed] });
};
