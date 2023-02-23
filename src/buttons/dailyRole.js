const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');
module.exports = {
    data: {
        name: 'dailyRole',
        description: 'Daily Role',
    },
    async execute(interaction, client, guildDb) {
        const { Settings } = await require(`../languages/${guildDb.language}.json`);

        const inter = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('selectMenuRole')
                    .setPlaceholder('Select a role')
            )

        interaction.update({ embeds: [], content: Settings.dailyRole, components: [inter], ephemeral: true })
    },
};
