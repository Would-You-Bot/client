const {
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder, PermissionFlagsBits,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');
const generateRather = require('../util/generateRather');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('rather')
        .setDescription('Get a would you rather question.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Erhalte eine Würdest du eher Frage.',
            "es-ES": 'Obtiene une pregunta ¿Qué prefieres?'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('useful')
            .setDescription('Get a useful would you rather question')
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?')))
        .addSubcommand((subcommand) => subcommand
            .setName('useless')
            .setDescription('Get a useless would you rather question')
            .addBooleanOption((option) => option
                .setName('voting')
                .setDescription('Do you want the users to be able to vote?'))),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */

    async execute(interaction, client, guildDb) {
        let voting = true;
        if (interaction.options.getBoolean('voting') == false) voting = false;
        const {Rather} = await require(`../languages/${guildDb.language}.json`);
        const {Useless_Powers, Useful_Powers} = await require(`../data/power-${guildDb.language}.json`);

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Invite')
                .setStyle(5)
                .setEmoji('🤖')
                .setURL(
                    'https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands',
                ),
        );
        const newButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Replay')
                .setStyle(1)
                .setEmoji('🔄')
                .setCustomId(voting ? `rather_${interaction.options.getSubcommand()}_voting` : `rather_${interaction.options.getSubcommand()}`),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
            rbutton = [button, newButton];
        } else rbutton = [newButton];
        switch (interaction.options.getSubcommand()) {
            case 'useful': {
                let powers = await generateRather(guildDb, Useful_Powers, "useful");
                let ratherembed = new EmbedBuilder()
                    .setColor('#0598F6')
                    .addFields(
                        {
                            name: Rather.embed.usefulname,
                            value: `> 1️⃣ ${powers.power1}`,
                            inline: false,
                        },
                        {
                            name: Rather.embed.usefulname2,
                            value: `> 2️⃣ ${powers.power2}`,
                            inline: false,
                        },
                    )
                    .setFooter({
                        text: `${Rather.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp();

                let message = await interaction
                    .reply({
                        embeds: [ratherembed],
                        components: guildDb.replay ? rbutton : [] || [],
                        fetchReply: true,
                    })
                    .catch((err) => {
                        return;
                    });
                if (interaction.options.getBoolean('voting') == false) {
                } else {
                    try {
                        await message.react('1️⃣');
                        await message.react('2️⃣');
                        const filter = (reaction) => reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣';

                        const collector = message.createReactionCollector({
                            filter,
                            time: 20000,
                        });
                        collector.on('collect', async () => {
                        });

                        collector.on('end', async () => {
                            if (
                                message.reactions.cache.get('1️⃣').count - 1
                                > message.reactions.cache.get('2️⃣').count - 1
                            ) {
                                ratherembed = new EmbedBuilder()
                                    .setColor('#0598F6')
                                    .setFooter({
                                        text: `${Rather.embed.footer}`,
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setTimestamp()
                                    .addFields({
                                        name: Rather.embed.thispower,
                                        value: `> 1️⃣ ${powers.power1}`,
                                        inline: false,
                                    });
                            } else if (
                                message.reactions.cache.get('1️⃣').count - 1
                                < message.reactions.cache.get('2️⃣').count - 1
                            ) {
                                ratherembed = new EmbedBuilder()
                                    .setColor('#0598F6')
                                    .setFooter({
                                        text: `${Rather.embed.footer}`,
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setTimestamp()
                                    .addFields({
                                        name: Rather.embed.thispower,
                                        value: `> 2️⃣ ${powers.power2}`,
                                        inline: false,
                                    });
                            } else {
                                ratherembed = new EmbedBuilder()
                                    .setColor('#ffffff')
                                    .addFields(
                                        {
                                            name: Rather.embed.usefulname,
                                            value: `> 1️⃣ ${powers.power1}`,
                                            inline: false,
                                        },
                                        {
                                            name: Rather.embed.usefulname2,
                                            value: `> 2️⃣ ${powers.power2}`,
                                            inline: false,
                                        },
                                    )
                                    .setFooter({
                                        text: `${Rather.embed.footer}`,
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setTimestamp();
                            }

                            try {
                                await message.reactions.removeAll();
                            } catch (error) {
                            }
                            await interaction
                                .editReply({
                                    embeds: [ratherembed],
                                    components: guildDb.replay ? rbutton : [] || [],
                                })
                                .catch((err) => {
                                    return;
                                });

                            collector.stop();
                        });
                    } catch (error) {
                    }
                }
            }
                break;

            case 'useless': {
                let powers = await generateRather(guildDb, Useless_Powers, "useless");
                let ratherembed = new EmbedBuilder()
                    .setColor('#F00505')
                    .addFields(
                        {
                            name: Rather.embed.uselessname,
                            value: `> 1️⃣ ${powers.power1}`,
                            inline: false,
                        },
                        {
                            name: Rather.embed.uselessname2,
                            value: `> 2️⃣ ${powers.power2}`,
                            inline: false,
                        },
                    )
                    .setFooter({
                        text: `${Rather.embed.footer}`,
                        iconURL: client.user.avatarURL(),
                    })
                    .setTimestamp();

                let message = await interaction
                    .reply({
                        embeds: [ratherembed],
                        fetchReply: true,
                        components: guildDb.replay ? rbutton : [] || [],
                    })
                    .catch((err) => {
                        return;
                    });
                if (interaction.options.getBoolean('voting') == false) {
                } else {
                    try {
                        if (interaction?.channel?.permissionsFor(client?.user?.id)?.has([
                            PermissionFlagsBits.AddReactions,
                        ])) {
                            await message.react('1️⃣');
                            await message.react('2️⃣');
                        }

                        const filter = (reaction) => reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣';

                        const collector = message.createReactionCollector({
                            filter,
                            time: 20000,
                        });

                        collector.on('end', async () => {
                            const msg = await message.fetch().catch((err) => {
                            });
                            if (msg) {
                                if (
                                    msg.reactions.cache.get('1️⃣').count - 1
                                    > msg.reactions.cache.get('2️⃣').count - 1
                                ) {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#F00505')
                                        .setFooter({
                                            text: `${Rather.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp()
                                        .addFields({
                                            name: Rather.embed.thispower,
                                            value: `> 1️⃣ ${powers.power1}`,
                                            inline: false,
                                        });
                                } else if (
                                    msg.reactions.cache.get('1️⃣').count - 1
                                    < msg.reactions.cache.get('2️⃣').count - 1
                                ) {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#F00505')
                                        .setFooter({
                                            text: `${Rather.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp()
                                        .addFields({
                                            name: Rather.embed.thispower,
                                            value: `> 2️⃣ ${powers.power2}`,
                                            inline: false,
                                        });
                                } else {
                                    ratherembed = new EmbedBuilder()
                                        .setColor('#ffffff')
                                        .addFields(
                                            {
                                                name: Rather.embed.uselessname,
                                                value: `> 1️⃣ ${powers.power1}`,
                                                inline: false,
                                            },
                                            {
                                                name: Rather.embed.uselessname2,
                                                value: `> 2️⃣ ${powers.power2}`,
                                                inline: false,
                                            },
                                        )
                                        .setFooter({
                                            text: `${Rather.embed.footer}`,
                                            iconURL: client.user.avatarURL(),
                                        })
                                        .setTimestamp();
                                }

                                try {
                                    await msg.reactions.removeAll();
                                } catch (error) {
                                }
                                await interaction
                                    .editReply({
                                        embeds: [ratherembed],
                                        components: guildDb.replay ? rbutton : [] || [],
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
            }
                break;
        }
    },
};
