const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('guide to use the bot and increase activity')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Anleitung, um den Bot zu verwenden und die Aktivität zu erhöhen',
            "es-ES": 'Guía para usar el bot y aumentar la actividad'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {

        const guideembed = new EmbedBuilder()
            .setColor('#0598F6')
            .setFooter({
                text: client.translation.get(guildDb?.language, 'Guide.embed.footer'),
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .setTitle(client.translation.get(guildDb?.language, 'Guide.embed.title'))
            .addFields(
                {
                    name: client.translation.get(guildDb?.language, 'Guide.embed.name1'),
                    value: client.translation.get(guildDb?.language, 'Guide.embed.value1'),
                    inline: false,
                },
                {
                    name: client.translation.get(guildDb?.language, 'Guide.embed.name2'),
                    value: client.translation.get(guildDb?.language, 'Guide.embed.value2'),
                    inline: false,
                },
                {
                    name: client.translation.get(guildDb?.language, 'Guide.embed.name3'),
                    value: client.translation.get(guildDb?.language, 'Guide.embed.value3'),
                    inline: false,
                },
            )
            .setDescription(client.translation.get(guildDb?.language, 'Guide.embed.description'));

        await interaction.reply({
            embeds: [guideembed],
        }).catch((err) => {
            console.log(err);
        });
    },
};
