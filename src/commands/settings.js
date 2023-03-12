const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");
const guildModel = require("../util/Models/guildModel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Change settings for Daily Messages and Welcomes")
        .setDMPermission(true)
        .setDescriptionLocalizations({
            de: "TBA",
            "es-ES": "TBA",
        })
        .addStringOption((option) =>
            option
                .setName("choose")
                .setDescription("Enable/disable daily Would You messages.")
                .setRequired(true)
                .addChoices(
                    { name: 'General Settings', value: 'general' },
                    { name: 'Daily Messages', value: 'daily_msg' },
                    { name: 'Welcomes', value: 'welcomes' },
                )
        ),

    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const { Settings } = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            switch (interaction.options.getString("choose")) {
                case "daily_msg":
                    const dailyMsgs = new EmbedBuilder()
                        .setTitle(Settings.embed.dailyTitle)
                        .setDescription(
                            `${Settings.embed.dailyMsg}: ${guildDb.dailyMsg ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.dailyChannel}: ${guildDb.dailyChannel ? `<#${guildDb.dailyChannel}>` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.dailyRole}: ${guildDb.dailyRole ? `<@&${guildDb.dailyRole}>` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.dailyTimezone}: ${guildDb.dailyTimezone}\n`
                        )
                        .setColor("#0598F6")
                        .setFooter({ text: Settings.embed.footer, iconURL: client.user.avatarURL(), })

                    const dailyButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("dailyMsg")
                                .setLabel(Settings.button.dailyMsg)
                                .setStyle(guildDb.dailyMsg ? "Success" : "Secondary"),
                            new ButtonBuilder()
                                .setCustomId("dailyChannel")
                                .setLabel(Settings.button.dailyChannel)
                                .setStyle(guildDb.dailyChannel ? "Success" : "Secondary"),
                        ), dailyButtons2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("dailyTimezone")
                                    .setLabel(Settings.button.dailyTimezone)
                                    .setStyle("Primary")
                                    .setEmoji("🌍"),
                                new ButtonBuilder()
                                    .setCustomId("dailyRole")
                                    .setLabel(Settings.button.dailyRole)
                                    .setStyle(guildDb.dailyRole ? "Success" : "Secondary"),
                            )

                    interaction.reply({ embeds: [dailyMsgs], components: [dailyButtons, dailyButtons2], ephemeral: true }).catch(() => { })
                    break;

                case "general":
                    const generalMsg = new EmbedBuilder()
                        .setTitle(Settings.embed.generalTitle)
                        .setDescription(`${Settings.embed.voteCooldown}: ${guildDb.voteCooldown ? `${guildDb.voteCooldown}` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.replayCooldown}: ${guildDb.replayCooldown ? `${guildDb.replayCooldown}` : `<:x_:1077962443013238814>`}\n`
                        )
                        .setColor("#0598F6")
                        .setFooter({ text: Settings.embed.footer, iconURL: client.user.avatarURL(), })

                    const generalButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("voteCooldown")
                                .setLabel(Settings.button.voteCooldown)
                                .setStyle(guildDb.voteCooldown ? "Success" : "Secondary"),
                            new ButtonBuilder()
                                .setCustomId("replayCooldown")
                                .setLabel(Settings.button.replayCooldown)
                                .setStyle(guildDb.replayCooldown ? "Success" : "Secondary"),
                        )

                    interaction.reply({ embeds: [generalMsg], components: [generalButtons], ephemeral: true }).catch(() => { })
                    break;

                case "welcomes":
                    const welcomes = new EmbedBuilder()
                        .setTitle(Settings.embed.welcomeTitle)
                        .setDescription(
                            `${Settings.embed.welcome}: ${guildDb.welcome ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.welcomePing}: ${guildDb.welcomePing ? `<:check:1077962440815411241>` : `<:x_:1077962443013238814>`}\n` +
                            `${Settings.embed.welcomeChannel}: ${guildDb.welcomeChannel ? `<#${guildDb.welcomeChannel}>` : `<:x_:1077962443013238814>`}`
                        )
                        .setColor("#0598F6")
                        .setFooter({ text: Settings.embed.footer, iconURL: client.user.avatarURL(), })

                    const welcomeButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("welcome")
                                .setLabel(Settings.button.welcome)
                                .setStyle(guildDb.welcome ? "Success" : "Secondary"),
                            new ButtonBuilder()
                                .setCustomId("welcomeChannel")
                                .setLabel(Settings.button.welcomeChannel)
                                .setStyle(guildDb.welcomeChannel ? "Success" : "Secondary"),
                        ), welcomeButtons2 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("welcomePing")
                                    .setLabel(Settings.button.welcomePing)
                                    .setStyle(guildDb.welcomePing ? "Success" : "Secondary"),
                            )

                    interaction.reply({ embeds: [welcomes], components: [welcomeButtons, welcomeButtons2], ephemeral: true });
                    break;
            }
        } else {
            const errorembed = new EmbedBuilder()
                .setColor('#F00505')
                .setTitle('Error!')
                .setDescription(Settings.embed.error);
            await interaction.reply({
                embeds: [errorembed],
                ephemeral: true,
            }).catch((err) => {
                return;
            });
        }
    },
};
