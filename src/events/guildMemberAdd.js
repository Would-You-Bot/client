const {EmbedBuilder, PermissionFlagsBits} = require('discord.js');
require('dotenv').config();

module.exports = async (client, member) => {
    // Always do simple if checks before the main code. This is a little but not so little performance boost :)
    if (member?.user?.bot) return;

    const guildDb = await client.database.getGuild(member.guild.id, false);
    if (guildDb && guildDb?.welcome) {
        const channel = await member.guild.channels.fetch(guildDb.welcomeChannel).catch(err => {
        });

        if (!channel?.id) return;

        if (!channel?.permissionsFor(client?.user?.id)?.has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks
        ])) return;

        const {Welcome} = await require(`../languages/${guildDb.language}.json`);
        const {Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);

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

        return channel.send({embeds: [wouldyouembed]}).catch((err) => {
        });
    }
};
