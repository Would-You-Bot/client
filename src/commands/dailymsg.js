const {
    EmbedBuilder,
    ChannelType,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');
function isValid(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        return false;
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    }
    catch (ex) {
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
    data: new SlashCommandBuilder()
        .setName('dailymsg')
        .setDescription('Daily Would You messages')
        .setDescriptionLocalizations({
            de: 'Tägliche Würdest du Nachrichten',
            "es-ES": '' ''
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
                            { name: 'true', value: 'true' },
                            { name: 'false', value: 'false' },
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
                            { name: 'true', value: 'true' },
                            { name: 'false', value: 'false' },
                        )
                )
        ),
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        let daily;
        guildLang
            .findOne({ guildID: interaction.guild.id })
            .then(async (result) => {
                const { Daily } = require(`../languages/${result.language}.json`);
                if (
                    interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
                ) {
                    switch (interaction.options.getSubcommand()) {
                        case 'message': {
                            if (result.dailyMsg && interaction.options.getString("message") === "true") return await interaction.reply({ ephemeral: true, content: `${Daily.embed.alreadytrue}` })
                            if (!result.dailyMsg && interaction.options.getString("message") === "false") return await interaction.reply({ ephemeral: true, content: `${Daily.embed.alreadyfalse}` })
                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyMsg: interaction.options.getString("message") === "true" ? true : false,
                                            },
                                        )
                                        .catch();
                                });
                            daily = new EmbedBuilder()
                                .setTitle(`${Daily.successEmbed.title} Would You`)
                                .setColor('#0598F6')
                                .setDescription(`${Daily.successEmbed.desc} ${interaction.options.getString("message") === "true" ? Daily.successEmbed.options : Daily.successEmbed.options2} ${Daily.successEmbed.desc2}${!result.dailyChannel ? `\n${Daily.successEmbed.desc3} ${interaction.options.getString("message") === "true" ? Daily.successEmbed.options : Daily.successEmbed.options2} ${Daily.successEmbed.desc4}` : ""}`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'types': {
                            if (result.dailyRather && interaction.options.getString("types") === "true") return await interaction.reply({ ephemeral: true, content: `${Daily.embed.alreadytrue}` })
                            if (!result.dailyRather && interaction.options.getString("types") === "false") return await interaction.reply({ ephemeral: true, content: `${Daily.embed.alreadyfalse}` })
                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyRather: interaction.options.getString("types") === "true" ? true : false,
                                            },
                                        )
                                        .catch();
                                });
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
                            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.options.getChannel("channel").id).has("ViewChannel")) return await interaction.reply({ ephemeral: true, content: Daily.errorChannel.viewChannel })
                            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.options.getChannel("channel").id).has("SendMessages")) return await interaction.reply({ ephemeral: true, content: Daily.errorChannel.sendMessages })
                            if (result.dailyChannel && result.dailyChannel === interaction.options.getChannel("channel").id) return await interaction.reply({ ephemeral: true, content: Daily.errorChannel.alreadySet })

                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyChannel: interaction.options.getChannel("channel").id,
                                            },
                                        )
                                        .catch();
                                });
                            daily = new EmbedBuilder()
                                .setTitle(Daily.success.title)
                                .setColor('#0598F6')
                                .setDescription(`${Daily.success.desc} <#${interaction.options.getChannel("channel").id}> ${Daily.success.desc2}`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'role': {
                            if (result.dailyRole && result.dailyRole === interaction.options.getRole("role").id) return await interaction.reply({ ephemeral: true, content: Daily.errorRole })

                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyRole: interaction.options.getRole("role").id,
                                            },
                                        )
                                        .catch();
                                });
                            daily = new EmbedBuilder()
                                .setTitle(Daily.success.title)
                                .setColor('#0598F6')
                                .setDescription(`${Daily.success.desc} \`${interaction.options.getRole("role").name}\` ${Daily.success.desc3}`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'timezone': {
                            if (result.dailyTimezone.toLowerCase() === interaction.options.getString("timezone").toLowerCase()) return await interaction.reply({ ephemeral: true, content: Daily.timezone.errorSame })
                            if (!isValid(interaction.options.getString("timezone").toLowerCase())) return await interaction.reply({ ephemeral: true, content: Daily.timezone.errorInvalid })
                            if (!dateType(interaction.options.getString("timezone").toLowerCase())) return await interaction.reply({ ephemeral: true, content: Daily.timezone.errorInvalid })
                            
                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyTimezone: interaction.options.getString("timezone"),
                                            },
                                        )
                                        .catch();
                                });
                            daily = new EmbedBuilder()
                                .setTitle(Daily.success.title)
                                .setColor('#0598F6')
                                .setDescription(`${Daily.timezone.desc} \`${interaction.options.getString("timezone")}\` ${Daily.timezone.desc2}`)
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
                    }).catch((err) => { return; });
                } else {
                    const errorembed = new EmbedBuilder()
                        .setColor('#F00505')
                        .setTitle('Error!')
                        .setDescription(Daily.embed.error);
                    await interaction.reply({
                        embeds: [errorembed],
                        ephemeral: true,
                    }).catch((err) => { return; });
                }
            });
    },
};
