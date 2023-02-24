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

        const {General} = await require(`../data/rather-${guildDb.language}.json`);
        const randomrather = Math.floor(Math.random() * General.length)
        let mention = null

        if (guildDb.welcomePing) {mention = `<@${member.user.id}>`}

        let welcomeEmbed = new EmbedBuilder()
        .setColor("#0598F6")
        .setFooter({text: `${member.user.tag} Joined`, iconURL: member.user.avatarURL()})
        .setDescription(`**${General[randomrather]}**`);


        return channel.send({content: mention, embeds: [welcomeEmbed]}).catch((err) => {
        });
    }
};
