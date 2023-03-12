const {
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder, PermissionFlagsBits,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('wouldyourather')
        .setDescription('Get a would you rather question.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Erhalte eine Würdest du eher Frage.',
            "es-ES": 'Obtiene une pregunta ¿Qué prefieres?'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {
        const {General} = await require(`../data/rather-${guildDb.language}.json`);
        const randomrather = Math.floor(Math.random() * General.length)

        let ratherembed = new EmbedBuilder()
        .setColor("#0598F6")
        .setFooter({text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomrather}`, iconURL: interaction.user.avatarURL()})
        .setDescription(General[randomrather]);

        const row = new ActionRowBuilder();
        if (Math.round(Math.random() * 15) < 3) {
            row.addComponents([
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setStyle(5)
                    .setEmoji('1009964111045607525')
                    .setURL(
                        'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands',
                    )
            ]);
        }
        row.addComponents([
            new ButtonBuilder()
                .setLabel('New Question')
                .setStyle(1)
                .setEmoji('1073954835533156402')
                .setCustomId(`wouldyourather`)
        ]);

        return interaction.reply({
            embeds: [ratherembed],
            components: guildDb.replay ? rbutton : [] || [],
        }).catch((err) => {

        });
    },
};
