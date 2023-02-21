const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require('discord.js');
const generateRather = require('../util/generateRather');

module.exports = {
    data: {
        name: 'wouldyourather',
        description: 'would you rather',
    },
    async execute(interaction, client, guildDb) {
        const {Rather} = await require(`../languages/${guildDb.language}.json`);
        const {General} = await require(`../data/rather-${guildDb.language}.json`);
        if (!guildDb.replay) return await interaction.reply({ephemeral: true, content: Rather.replays.disabled})
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('1009964111045607525')
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands',
                ),
        );
        const newButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('New Question')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId('wouldyourather'),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
        } else rbutton = [newButton];
        {
            const randomrather = Math.floor(Math.random() * General.length)

            let ratherembed = new EmbedBuilder()
            .setColor("#0598F6")
            
            .setFooter({text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomrather}`, iconURL: interaction.user.avatarURL()})
            .setDescription(General[randomrather]);

            await interaction
                .reply({
                    embeds: [ratherembed],
                    components: rbutton,
                    fetchReply: true,
                })
                .catch((err) => {
                    return;
                });
        }
    },
};
