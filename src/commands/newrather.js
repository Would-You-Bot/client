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
        .setName('newrather')
        .setDescription('Get a would you rather question.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Erhalte eine Würdest du eher Frage.',
            "es-ES": 'Obtiene une pregunta ¿Qué prefieres?'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {
        const {General} = await require(`../data/rather-${guildDb.language}.json`);
        const randomrather = Math.floor(Math.random() * General.length)

        let ratherembed = new EmbedBuilder()
        .setColor("#0598F6")
        
        .setFooter({text: `Requested by ${interaction.user.username} | Type: General | ID: ${randomrather}`, iconURL: interaction.user.avatarURL()})
        .setDescription(General[randomrather]);

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=275415247936&scope=bot%20applications.commands',
                ),
        );
        const newButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('New Question')
                .setStyle(1)
                .setEmoji('1073954835533156402')
                .setCustomId(voting ? `rather_useful_voting` : `rather_useful`),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
        } else rbutton = [newButton];
       
        await interaction.reply({
            embeds: [ratherembed],
            components: guildDb.replay ? rbutton : [] || [],
        }).catch((err) => {
            return;
        });

    },
};
