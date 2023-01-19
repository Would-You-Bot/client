const {
    EmbedBuilder,
    ChannelType,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

function isValid(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        return false;
    }

    try {
        Intl.DateTimeFormat(undefined, {timeZone: tz});
        return true;
    } catch (ex) {
        return false;
    }
}

function dateType(tz) {
    if (!tz.includes("/")) return false;
    let text = tz.split("/");

    if (text.length === 2) return true
    else return false;
}

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('dailymsg')
        .setDescription('Daily Would You messages')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Tägliche Würdest du Nachrichten',
            "es-ES": 'Mensajes Would You diarios'
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("channel")
                .setDescription("Sets a channel for daily Would You messages.")
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                        .setDescription('Choose which channel you want to use for daily Would You messages.')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("role")
                .setDescription("Sets a role for daily Would You messages mentions.")
                .addRoleOption(option => option.setName('role').setRequired(true).setDescription('Choose which role you want to use for daily Would You mentions.')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("timezone")
                .setDescription("Pick a timezone for your server for when messages should be sent.")
                .addStringOption((option) =>
                    option
                        .setName("timezone")
                        .setDescription("Pick a timezone for your server for when messages should be sent.")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("message")
                .setDescription("Enable/disable daily Would You messages.")
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("Enable/disable daily Would You messages.")
                        .setRequired(true)
                        .addChoices(
                            {name: 'true', value: 'true'},
                            {name: 'false', value: 'false'},
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("types")
                .setDescription("Enable/disable to change the message to a rather message.")
                .addStringOption((option) =>
                    option
                        .setName("types")
                        .setDescription("Change Daily Messages to rather messages.")
                        .setRequired(true)
                        .addChoices(
                            {name: 'true', value: 'true'},
                            {name: 'false', value: 'false'},
                        )
                )
        ),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        let daily;
        const {Daily} = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getSubcommand()) {
                case 'message': {
                    if (guildDb.dailyMsg && interaction.options.getString("message") === "true") return await interaction.reply({
                        ephemeral: true,
                        content: `${Daily.embed.alreadytrue}`
                    })
                    if (!guildDb.dailyMsg && interaction.options.getString("message") === "false") return await interaction.reply({
                        ephemeral: true,
                        content: `${Daily.embed.alreadyfalse}`
                    })
                    await client.database.updateGuild(interaction.guildId, {
                        dailyMsg: interaction.options.getString("message") === "true" ? true : false,
                    }, true)

                    daily = new EmbedBuilder()
                        .setTitle(`${Daily.successEmbed.title} Would You`)
                        .setColor('#0598F6')
                        .setDescription(`${Daily.successEmbed.desc} ${interaction.options.getString("message") === "true" ? Daily.successEmbed.options : Daily.successEmbed.options2} ${Daily.successEmbed.desc2}${!guildDb.dailyChannel ? `\n${Daily.successEmbed.desc3} ${interaction.options.getString("message") === "true" ? Daily.successEmbed.options : Daily.successEmbed.options2} ${Daily.successEmbed.desc4}` : ""}`)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                }

                case 'types': {
                    const types = interaction.options.getString("types") === "true" ? true : false;

                    if (guildDb.dailyRather && types) return await interaction.reply({
                        ephemeral: true,
                        content: `${Daily.embed.alreadytrue}`
                    })
                    if (!guildDb.dailyRather && !types) return await interaction.reply({
                        ephemeral: true,
                        content: `${Daily.embed.alreadyfalse}`
                    })

                    await client.database.updateGuild(interaction.guildId, {
                        dailyRather: types,
                    }, true)

                    daily = new EmbedBuilder()
                        .setTitle(`${Daily.successEmbed.title} Would You`)
                        .setColor('#0598F6')
                        .setDescription(`${Daily.successEmbed.desc} ${interaction.options.getString("types") === "true" ? Daily.successEmbed.options : Daily.successEmbed.options2} ${Daily.successEmbed.desc22}`)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                }

                case 'channel': {
                    const channel = interaction.options.getChannel("channel");

                    if (!channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBit.ViewChannel])) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.errorChannel.viewChannel
                    })
                    if (!channel?.permissionsFor(client?.user?.id)?.has([PermissionFlagsBit.SendMessages])) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.errorChannel.sendMessages
                    })
                    if (guildDb.dailyChannel && guildDb.dailyChannel === channel.id) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.errorChannel.alreadySet
                    })

                    await client.database.updateGuild(interaction.guildId, {
                        dailyChannel: channel.id,
                    }, true)

                    daily = new EmbedBuilder()
                        .setTitle(Daily.success.title)
                        .setColor('#0598F6')
                        .setDescription(`${Daily.success.desc} <#${channel.id}> ${Daily.success.desc2}`)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                }

                case 'role': {
                    const role = interaction.options.getRole("role");

                    if (guildDb.dailyRole && guildDb.dailyRole === role.id) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.errorRole
                    })

                    await client.database.updateGuild(interaction.guildId, {
                        dailyRole: role.id,
                    }, true)

                    daily = new EmbedBuilder()
                        .setTitle(Daily.success.title)
                        .setColor('#0598F6')
                        .setDescription(`${Daily.success.desc} \`${role.name}\` ${Daily.success.desc3}`)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                }

                case 'timezone': {
                    const userInput = interaction.options.getString("timezone");
                    const lowerCaseUserInput = userInput.toLowerCase();

                    if (guildDb.dailyTimezone.toLowerCase() === lowerCaseUserInput) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.timezone.errorSame
                    })
                    if (!isValid(lowerCaseUserInput)) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.timezone.errorInvalid
                    })
                    if (!dateType(lowerCaseUserInput)) return await interaction.reply({
                        ephemeral: true,
                        content: Daily.timezone.errorInvalid
                    })

                    await client.database.updateGuild(interaction.guildId, {
                        dailyTimezone: userInput,
                    }, true)

                    daily = new EmbedBuilder()
                        .setTitle(Daily.success.title)
                        .setColor('#0598F6')
                        .setDescription(`${Daily.timezone.desc} \`${userInput}\` ${Daily.timezone.desc2}`)
                        .setFooter({
                            text: 'Would You',
                            iconURL: client.user.avatarURL(),
                        });
                    break;
                }
            }
            await interaction.reply({
                embeds: [daily],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        } else {
            const errorembed = new EmbedBuilder()
                .setColor('#F00505')
                .setTitle('Error!')
                .setDescription(Daily.embed.error);
            await interaction.reply({
                embeds: [errorembed],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        }
    },
};
