const {ButtonBuilder, ActionRowBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: {
        name: 'wycustom_decline',
        description: 'WyCustom Decline',
    },
    async execute(interaction, client, guildDb) {
        const {wyCustom} = await require(`../languages/${guildDb.language}.json`);

        const typeEmbed = new EmbedBuilder()
            .setTitle(wyCustom.success.embedRemoveAll.decline)
            .setColor("#0598F4")
            .setFooter({
                text: 'Would You',
                iconURL: client.user.avatarURL(),
            });

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Accept')
                .setStyle(4)
                .setDisabled(true)
                .setCustomId('accept'),
            new ButtonBuilder()
                .setLabel('Decline')
                .setStyle(2)
                .setDisabled(true)
                .setCustomId('decline'),
        );

        return interaction.update({embeds: [typeEmbed], components: [button]})
    },
};
