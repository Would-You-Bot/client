const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('wytype')
        .setDescription('Changes the type of messages that will be used for WWYD.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Ändert den Typ der Nachrichten, die für WWYD verwendet werden.',
            "es-ES": 'Cambia el tipo de mensajes que se utilizarán para WWYD.'
        })
        .addSubcommand((subcommand) => subcommand.setName('regular').setDescription('This changes it to use only default messages.'))
        .addSubcommand((subcommand) => subcommand.setName('mixed').setDescription('This changes it to use both custom & default messages.'))
        .addSubcommand((subcommand) => subcommand.setName('custom').setDescription('This changes it to use only custom messages.')),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {
        let typeEmbed;
        const {Language, wyType} = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getSubcommand()) {
                case 'regular':
                    await client.database.updateGuild(interaction.guildId, {
                        customTypes: 'regular',
                    }, true);

                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyType.embed.title)
                        .setDescription(wyType.embed.descDef)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                case 'mixed':
                    await client.database.updateGuild(interaction.guildId, {
                        customTypes: 'mixed',
                    }, true);

                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyType.embed.title)
                        .setDescription(wyType.embed.descBoth)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                case 'custom':
                    await client.database.updateGuild(interaction.guildId, {
                        customTypes: 'custom',
                    }, true);

                    typeEmbed = new EmbedBuilder()
                        .setTitle(wyType.embed.title)
                        .setDescription(wyType.embed.descCust)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
            }

            return interaction.reply({
                embeds: [typeEmbed],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        } else {
            const errorembed = new EmbedBuilder()
                .setColor('#F00505')
                .setTitle('Error!')
                .setDescription(Language.embed.error);

            return interaction.reply({
                embeds: [errorembed],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        }
    },
};
