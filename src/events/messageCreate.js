const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require('discord.js');
module.exports = async (client, message) => {
    const embed = new EmbedBuilder()
        .setAuthor({ name: "Hello, my name is Would You.", iconURL: "https://cdn.discordapp.com/emojis/953349395955470406.gif?size=40&quality=lossless" })
        .setDescription(`My purpose is to help users have better engagement in your servers to bring up more activity! You can use </help:596546848882163723> to see all of my commands.`)
        .setColor('#0598F6')

    const supportbutton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('📋')
            .setURL('https://discord.gg/vMyXAxEznS'),
        new ButtonBuilder()
            .setLabel('Support')
            .setStyle(5)
            .setEmoji('❤️')
            .setURL('https://discord.gg/vMyXAxEznS'),
    );

    if (message.content && (new RegExp(`^(<@!?${client.user.id}>)`)).test(message.content)) return message.channel.send({
        embeds: [embed],
        components: [supportbutton]
    });

};
