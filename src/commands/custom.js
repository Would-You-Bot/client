const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
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
        const {
            Custom,
            WouldYou,
            Rather,
            Wwyd,
        } = await require(`../languages/${guildDb.language}.json`);

        let message;

        switch (interaction.options.getSubcommand()) {
            case 'wouldyou':
                let wouldyouembed = new EmbedBuilder()
                    .setTitle(Custom.embed.title)
                    .setDescription(`> ${interaction.options.getString('message')}`)
                    .setColor('#0598F6')
                    .setFooter({
                        text: `${Custom.embed.footer}`,
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
                if (interaction.options.getBoolean('voting') === true) {
                    try {
                        if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                            PermissionFlagsBits.AddReactions,
                        ])) {
                            await message.react('✅');
                            await message.react('❌');
                        }

                        const filter = (reaction) => reaction.emoji.name === '✅' || reaction.emoji.name === '❌';

                        const collector = message.createReactionCollector({
                            filter,
                            time: 20000,
                        });

                        collector.on('end', async () => {
                            const msg = await message.fetch().catch((err) => {
                            });

                            if (msg) {
                                const checksCount = msg.reactions.cache.get('✅')?.count ?? 0;
                                const crossCount = msg.reactions.cache.get('❌')?.count ?? 0;

                                const totalreactions = checksCount
                                    - 1
                                    + crossCount
                                    - 1;
                                let percentage = Math.round(
                                    ((checksCount - 1)
                                        / totalreactions)
                                    * 100,
                                );
                                let emoji = null;
                                let color = null;
                                const userstotal = totalreactions < 2
                                    ? `${WouldYou.stats.user}`
                                    : `${WouldYou.stats.users}`;

                                if (
                                    checksCount
                                    - 1
                                    + crossCount -
                                    1 == 0
                                ) {
                                    percentage = 0;
                                    emoji = '🤷';
                                    color = '#F0F0F0';
                                }

                                if (percentage > 50) {
                                    color = '#0598F6';
                                    emoji = '✅';
                                } else if (percentage < 50) {
                                    color = '#F00505';
                                    emoji = '❌';
                                } else {
                                    color = '#F0F0F0';
                                    emoji = '🤷';
                                }

                                wouldyouembed = new EmbedBuilder()
                                    .setColor(color)
                                    .setFooter({
                                        text: `${WouldYou.embed.footer}`,
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setTimestamp()
                                    .addFields(
                                        {
                                            name: WouldYou.embed.Uselessname,
                                            value: `> ${interaction.options.getString('message')}`,
                                            inline: false,
                                        },
                                        {
                                            name: 'Stats',
                                            value: `> **${percentage}%** ${WouldYou.stats.of} **${totalreactions} ${userstotal}** ${WouldYou.stats.taking} ${emoji}`,
                                        },
                                    );

                                try {
                                    if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBits.ManageMessages])) await msg.reactions.removeAll();
                                } catch (error) {
                                }

                                collector.stop();

                                return interaction
                                    .editReply({
                                        embeds: [wouldyouembed],
                                    })
                                    .catch((err) => {
                                        return;
                                    });
                            }
                        });
                    } catch (error) {
                    }
                }
                break;
            case 'rather':
                let ratherembed = new EmbedBuilder()
                    .setColor('#0598F6')
                    .addFields({
                        name: Rather.embed.usefulname,
                        value: `> 1️⃣ ${interaction.options.getString('messagetop')}`,
                        inline: false,
                    })
                    .addFields({
                        name: Rather.embed.usefulname2,
                        value: `> 2️⃣ ${interaction.options.getString('messagebottom')}`,
                        inline: false,
                    })
                    .setFooter({
                        text: `${Rather.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp();

                message = await interaction
                    .reply({
                        embeds: [ratherembed],
                        fetchReply: true,
                    })
                    .catch((err) => {
                        return;
                    });

                if (interaction.options.getBoolean('voting') === true) {
                    try {
                        if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                            PermissionFlagsBits.AddReactions,
                        ])) {
                            await message.react('1️⃣');
                            await message.react('2️⃣');
                        }

                        const filter = (reaction) => reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣';

                        const collector = message.createReactionCollector({
                            filter,
                            time: 20000,
                        });

                        collector.on('end', async () => {
                            const msg = await message.fetch().catch((err) => {
                            });

                            if (msg) {
                                const oneCount = msg.reactions.cache.get('1️⃣')?.count ?? 0;
                                const twoCount = msg.reactions.cache.get('2️⃣')?.count ?? 0;

                                if (
                                    oneCount - 1
                                    > twoCount - 1
                                ) {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#0598F6')
                                        .setFooter({
                                            text: `${WouldYou.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp()
                                        .addFields({
                                            name: Rather.embed.thispower,
                                            value: `> 1️⃣ ${interaction.options.getString(
                                                'messagetop',
                                            )}`,
                                            inline: false,
                                        });
                                } else if (
                                    oneCount - 1
                                    < twoCount - 1
                                ) {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#0598F6')
                                        .setFooter({
                                            text: `${WouldYou.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp()
                                        .addFields({
                                            name: Rather.embed.thispower,
                                            value: `> 2️⃣ ${interaction.options.getString(
                                                'messagebottom',
                                            )}`,
                                            inline: false,
                                        });
                                } else {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#0598F6')
                                        .setDescription('Nobody gave a vote')
                                        .setFooter({
                                            text: `${Rather.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp();
                                }

                                try {
                                    if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBits.ManageMessages])) await msg.reactions.removeAll();
                                } catch (error) {
                                }
                                await interaction
                                    .editReply({
                                        embeds: [ratherembed],
                                    })
                                    .catch((err) => {
                                        return;
                                    });

                                collector.stop();
                            }
                        });
                    } catch (error) {
                    }
                }
                break;
            case 'wwyd':
                const wwydembed = new EmbedBuilder()

                    .setColor('#0598F6')
                    .setFooter({
                        text: `${Wwyd.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp()
                    .setTitle(Wwyd.embed.title)
                    .setDescription(`> ${interaction.options.getString('message')}`);

                interaction.reply({embeds: [wwydembed]}).catch((err) => {

                });

                break;
        }
    },
};
