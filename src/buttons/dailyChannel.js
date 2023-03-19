const { ActionRowBuilder, ChannelType, ChannelSelectMenuBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'dailyChannel',
        description: 'Daily Channel',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = require(`../languages/${guildDb.language}.json`);

        const inter = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('selectMenuChannel')
                    .setPlaceholder('Select a channel')
                    .addChannelTypes(ChannelType.GuildText)
            )

        interaction.update({ content: null, embeds: [], content: Settings.dailyChannel, components: [inter], ephemeral: true })
    },
};
