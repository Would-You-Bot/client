const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const guildLang = require('../util/Models/guildModel');
require("dotenv").config();
const Topgg = require(`@top-gg/sdk`)
const api = new Topgg.Api(process.env.TOPGGTOKEN)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Edit the replay system.')
        .setDescriptionLocalizations({
            de: 'Bearbeite das Replay System.',
            "es-ES": 'Editar el sistema de repetición.'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('toggle')
            .setDescription('Enable/disable the replay button')
            .addBooleanOption((option) =>
                option
                    .setName('enable')
                    .setDescription('Disable or enable the replay button.')
                    .setRequired(true)
            ))
        .addSubcommand((subcommand) => subcommand
            .setName('cooldown')
            .setDescription('Change the cooldown for the replay button.')
            .addNumberOption((option) =>
                option
                    .setName('cooldown')
                    .setDescription('Change the cooldown for the replay button. Use seconds to determine how long.')
                    .setRequired(true)
            )),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        guildLang
            .findOne({ guildID: interaction.guild.id })
            .then(async (result) => {
                const { REPLAY } = require(`../languages/${result.language}.json`);
                if (
                    interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
                ) {
                    switch (interaction.options.getSubcommand()) {
                        case "toggle":
                            if (interaction.options.getBoolean('enable') == true) {
                                guildLang
                                    .findOne({ guildID: interaction.guild.id })
                                    .then(async () => {
                                        await guildLang.findOneAndUpdate(
                                            { guildID: interaction.guild.id },
                                            {
                                                replay: true,
                                            }
                                        );
                                        if (result.replay == true) {
                                            const nochannelEmbed = new EmbedBuilder()
                                                .setColor("#2f3037")
                                                .setTitle("Error!")
                                                .setDescription(REPLAY.embed.errorAlready2);
                                            await interaction
                                                .reply({
                                                    embeds: [nochannelEmbed],
                                                    ephemeral: true,
                                                })
                                                .catch((err) => {
                                                    return;
                                                });
                                        } else {
                                            const savedchannelEmbed = new EmbedBuilder()
                                                .setColor("#2f3037")
                                                .setTitle(REPLAY.embed.title)
                                                .setDescription(`${REPLAY.embed.description} **${interaction.options.getBoolean('enable')}**`);
                                            await interaction
                                                .reply({
                                                    embeds: [savedchannelEmbed],
                                                    ephemeral: true,
                                                })
                                                .catch((err) => {
                                                    return;
                                                });
                                        }
                                    });
                            }
                            if (interaction.options.getBoolean('enable') == false) {
                                guildLang
                                    .findOne({ guildID: interaction.guild.id })
                                    .then(async (result) => {
                                        if (result.replay == false) {
                                            const nochannelEmbed = new EmbedBuilder()
                                                .setColor("#2f3037")
                                                .setTitle("Error!")
                                                .setDescription(REPLAY.embed.errorAlready);
                                            await interaction
                                                .reply({
                                                    embeds: [nochannelEmbed],
                                                    ephemeral: true,
                                                })
                                                .catch((err) => {
                                                    return;
                                                });
                                        } else {
                                            result.replay = false;
                                            await result.save();

                                            const removednsfwembed = new EmbedBuilder()
                                                .setColor("#2f3037")
                                                .setTitle("Success!")
                                                .setDescription(REPLAY.embed.success);
                                            await interaction
                                                .reply({
                                                    embeds: [removednsfwembed],
                                                    ephemeral: true,
                                                })
                                                .catch((err) => {
                                                    return;
                                                });
                                        }
                                    });
                            }
                            break;
                        case "cooldown":
                            guildLang
                                .findOne({ guildID: interaction.guild.id })
                                .then(async (result) => {
                                    result.replayCooldown = interaction.options.get('cooldown').value * 1000;
                                    result.save();

                                    const nochannelEmbed = new EmbedBuilder()
                                        .setColor("#2f3037")
                                        .setTitle("Error!")
                                        .setDescription(`${REPLAY.embed.cooldownSuccess}\`${interaction.options.get('cooldown').value.toLocaleString()}\`${REPLAY.embed.cooldownSuccess2}`);
                                    await interaction
                                        .reply({
                                            embeds: [nochannelEmbed],
                                            ephemeral: true,
                                        })
                                        .catch((err) => {
                                            return;
                                        });
                                });
                            break;
                    }
                } else {
                    const errorembed = new EmbedBuilder()
                        .setColor("#F00505")
                        .setTitle("Error!")
                        .setDescription(REPLAY.embed.missingPerms);
                    await interaction
                        .reply({
                            embeds: [errorembed],
                            ephemeral: true,
                        })
                        .catch((err) => {
                            return;
                        });
                }
            });
    },
};