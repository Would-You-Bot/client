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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailymsg')
        .setDescription('Daily Would You messages')
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
                .setName("options")
                .setDescription("Enable/disable daily Would You messages.")
                .addStringOption((option) =>
                    option
                        .setName("options")
                        .setDescription("Enable/disable daily Would You messages.")
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
                const { Language } = require(`../languages/${result.language}.json`);
                if (
                    interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
                ) {
                    switch (interaction.options.getSubcommand()) {
                        case 'options': {
                            if (result.dailyMsg && interaction.options.getString("options") === "true") return await interaction.reply({ ephemeral: true, content: "This option is already on, you can turn it off by using the command and selecting `false`" })
                            if (!result.dailyMsg && interaction.options.getString("options") === "false") return await interaction.reply({ ephemeral: true, content: "This option is already off, you can turn it on by using the command and selecting `true`" })
                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async () => {
                                    await guildLang
                                        .findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                dailyMsg: `${interaction.options.getString("options") === "true" ? true : false}`,
                                            },
                                        )
                                        .catch();
                                });
                            daily = new EmbedBuilder()
                                .setTitle('Daily Would You')
                                .setDescription(`Successfully ${interaction.options.getString("options") === "true" ? "enabled" : "disabled"} daily Would You messages!${!result.dailyChannel ? `\nSince you ${interaction.options.getString("options") === "true" ? "enabled" : "disabled"} daily messages, you can set a channel for them using \`/dailymsg channel\`` : ""}`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'channel': {
                            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.options.getChannel("channel").id).has("ViewChannel")) return await interaction.reply({ ephemeral: true, content: "The channel provided doesn't allow me to view it. Select a channel which I have access to." })
                            if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.options.getChannel("channel").id).has("SendMessages")) return await interaction.reply({ ephemeral: true, content: "The channel provided doesn't allow me to send messages to it. Select a channel which I have access to." })
                            if (result.dailyChannel && result.dailyChannel === interaction.options.getChannel("channel").id) return await interaction.reply({ ephemeral: true, content: "The provided channel is the same channel that is already set. Make sure to choose a different channel." })

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
                                .setTitle('Daily Would You')
                                .setDescription(`Successfully set <#${interaction.options.getChannel("channel").id}> for daily Would You messages.\nIf you haven't already, you can set the server's timezone for when it will send the message by using \`/dailymsg timezone\`. It's by default \`America/Chicago\``)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'role': {
                            if (result.dailyRole && result.dailyRole === interaction.options.getRole("role").id) return await interaction.reply({ ephemeral: true, content: "The provided role is the same role that is already set. Make sure to choose a different role." })

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
                                .setTitle('Daily Would You')
                                .setDescription(`Successfully set \`${interaction.options.getRole("role").name}\` role for daily Would You mentions.`)
                                .setFooter({
                                    text: 'Would You',
                                    iconURL: client.user.avatarURL(),
                                });
                            break;
                        }

                        case 'timezone': {
                            if (result.dailyTimezone.toLowerCase() === interaction.options.getString("timezone").toLowerCase().id) return await interaction.reply({ ephemeral: true, content: "The provided timezone is the same timezone that is already set. Make sure to choose a different timezone." })

                            if (!isValid(interaction.options.getString("timezone").toLowerCase())) return await interaction.reply({ ephemeral: true, content: `Provided timezone was invalid, you can pick a valid timezone from this [Time Zone Picker](https://kevinnovak.github.io/Time-Zone-Picker/)` })
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
                                .setTitle('Daily Would You')
                                .setDescription(`Successfully set \`${interaction.options.getString("timezone")}\` timezone for daily Would You.`)
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
                        .setDescription(Language.embed.error);
                    await interaction.reply({
                        embeds: [errorembed],
                        ephemeral: true,
                    }).catch((err) => { return; });
                }
            });
    },
};
