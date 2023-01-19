const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Change settings for the welcome system')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Ändere die Einstellungen für das Willkommenssystem',
            "es-ES": 'Cambiar la configuración del sistema de bienvenida'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('remove')
            .setDescription('Remove the welcome channel'))
        .addSubcommand((subcommand) => subcommand
            .setName('add')
            .setDescription('Add a welcome channel')
            .addChannelOption((option) => option
                .setName('channel')
                .setDescription('Channel for the welcome text')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const {Welcome} = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getSubcommand()) {
                case 'add':
                    const channel = interaction.options.getChannel('channel');

                    await client.database.updateGuild(interaction.guildId, {
                        welcome: true,
                        welcomeChannel: channel.id,
                    }, true);

                    const savedchannelEmbed = new EmbedBuilder()
                        .setColor('#2f3037')
                        .setTitle(Welcome.savedchannel.title)
                        .setDescription(`${Welcome.savedchannel.description} **<#${interaction.options.get('channel').value}>** ${Welcome.savedchannel.description2}`);

                    await interaction
                        .reply({
                            embeds: [savedchannelEmbed],
                            ephemeral: true,
                        })
                        .catch((err) => {
                            return;
                        });
                    break;
                case 'remove':
                    if (guildDb.welcome == false) {
                        const nochannelEmbed = new EmbedBuilder()
                            .setColor('#2f3037')
                            .setTitle(Welcome.nochannel.title)
                            .setDescription(Welcome.nochannel.description);

                        return interaction
                            .reply({
                                embeds: [nochannelEmbed],
                                ephemeral: true,
                            })
                            .catch((err) => {
                                return;
                            });
                    }

                    await client.database.updateGuild(interaction.guildId, {
                        welcome: false,
                    }, true);

                    const removedchannelEmbed = new EmbedBuilder()
                        .setColor('#2f3037')
                        .setTitle(Welcome.removeembed.title)
                        .setDescription(Welcome.removeembed.description);
                    return interaction
                        .reply({
                            embeds: [removedchannelEmbed],
                            ephemeral: true,
                        })
                        .catch((err) => {
                            return;
                        });
            }
        } else {
            const errorembed = new EmbedBuilder()
                .setColor('#F00505')
                .setTitle('Error!')
                .setDescription(Welcome.error.description);

            return interaction
                .reply({
                    embeds: [errorembed],
                    ephemeral: true,
                })
                .catch((err) => {
                    return;
                });
        }
    },
};
