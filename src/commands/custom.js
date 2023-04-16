const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('custom')
        .setDescription('Send a custom would you message')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Sende eine benutzerdefinierte Would you Nachricht',
            "es-ES": 'Envía un mensaje Would you personalizado'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('wouldyou')
            .setDescription('Custom /wouldyou message')
            .addStringOption((option) => option
                .setName('message')
                .setDescription('Input for the custom message')
                .setRequired(true))
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?')))
        .addSubcommand((subcommand) => subcommand
            .setName('wwyd')
            .setDescription('Custom what would you do message')
            .addStringOption((option) => option
                .setName('message')
                .setDescription('Input for the custom message')
                .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
            .setName('rather')
            .setDescription('Custom would you rather message')
            .addStringOption((option) => option
                .setRequired(true)
                .setName('messagetop')
                .setDescription('Input for the custom'))
            .addStringOption((option) => option
                .setRequired(true)
                .setName('messagebottom')
                .setDescription('Input for the custom'))
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?'))),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {

        let message;

        switch (interaction.options.getSubcommand()) {
            case 'wouldyou':
                let wouldyouembed = new EmbedBuilder()
                    .setTitle(client.translation.get(guildDb?.language, 'Custom.embed.title'))
                    .setDescription(`> ${interaction.options.getString('message')}`)
                    .setColor('#0598F6')
                    .setFooter({
                        text: client.translation.get(guildDb?.language, 'Custom.embed.footer'),
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp();

                message = await interaction
                    .reply({
                        embeds: [wouldyouembed],
                        fetchReply: true,
                    })
                    .catch((err) => {
                        return;
                    });

                // @TODO: Voting here

                break;
            case 'rather':
                let ratherembed = new EmbedBuilder()
                    .setColor('#0598F6')
                    .addFields({
                        name: client.translation.get(guildDb?.language, 'Rather.embed.usefulname'),
                        value: `> 1️⃣ ${interaction.options.getString('messagetop')}`,
                        inline: false,
                    })
                    .addFields({
                        name: client.translation.get(guildDb?.language, 'Rather.embed.usefulname2'),
                        value: `> 2️⃣ ${interaction.options.getString('messagebottom')}`,
                        inline: false,
                    })
                    .setFooter({
                        text: client.translation.get(guildDb?.language, 'Rather.embed.footer'),
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp();

                message = await interaction
                    .reply({
                        embeds: [ratherembed],
                        fetchReply: true,
                    })
                    .catch((err) => {
                        return console.log(err)
                    });

                // @TODO: Voting here

                break;
            case 'wwyd':
                const wwydembed = new EmbedBuilder()

                    .setColor('#0598F6')
                    .setFooter({
                        text: client.translation.get(guildDb?.language, 'Wwyd.embed.footer'),
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp()
                    .setTitle(client.translation.get(guildDb?.language, 'Wwyd.embed.title'))
                    .setDescription(`> ${interaction.options.getString('message')}`);

                interaction.reply({ embeds: [wwydembed] }).catch((err) => {
                    console.log(err)
                });

                // @TODO: Voting here

                break;
        }
    },
};
