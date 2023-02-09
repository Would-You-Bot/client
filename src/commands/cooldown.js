const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const guildModel = require('../util/Models/guildModel');
function time(str, sec = false) {
    const x = sec ? 1 : 1000;
    if (typeof str !== 'string') return 0;
    const fixed = str.replace(/\s/g, '');
    const tail = +fixed.match(/-?\d+$/g) || 0;
    const parts = (fixed.match(/-?\d+[^-0-9]+/g) || [])
        .map(v => +v.replace(/[^-0-9]+/g, '') * ({ s: x, m: 60 * x, h: 3600 * x, d: 86400 * x }[v.replace(/[-0-9]+/g, '')] || 0));
    return [tail, ...parts].reduce((a, b) => a + b, 0);
};
module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('cooldown')
        .setDescription('Configure cooldown for multiple commands.')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'TBA',
            "es-ES": 'TBA'
        })
        .addSubcommand((subcommand) => subcommand
            .setName('replay')
            .setDescription('Cooldown for Replay Button')
            .addStringOption((option) =>
                option
                    .setName('time')
                    .setDescription('Change the cooldown for the voting timer. Example: 30s, 5m, 2d')
                    .setRequired(true)
            ))
        .addSubcommand((subcommand) => subcommand
            .setName('voting')
            .setDescription('Cooldown for Voting Timer.')
            .addStringOption((option) =>
                option
                    .setName('time')
                    .setDescription('Change the cooldown for the voting timer. Example: 30s, 5m, 2d')
                    .setRequired(true)
            )),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const { COOLDOWN } = require(`../languages/${guildDb.language}.json`);
        if (
            interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            const timeStamp = interaction.options.getString('time')
            switch (interaction.options.getSubcommand()) {
                case "replay":
                    const replay = time(timeStamp);
                    if (replay < 5000) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.notEnough })
                    else if (replay > 86400000) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.tooMuchReplay })
                    else if (timeStamp.includes("-")) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.syntax })

                    await client.database.updateGuild(interaction.guildId, {
                        replayCooldown: replay
                    }, true)

                    const replayembed = new EmbedBuilder()
                        .setColor("#2f3037")
                        .setDescription(`${COOLDOWN.embed.replaySuccess}\`${timeStamp}\``);
                    await interaction.reply({
                            embeds: [replayembed],
                            ephemeral: true,
                        })
                        .catch((err) => {

                        });
                    break;
                case "voting":
                    const voting = time(timeStamp);
                    if (voting < 5000) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.notEnough })
                    else if (voting > 604800000) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.tooMuch })
                    else if (timeStamp.includes("-")) return interaction.reply({ ephemeral: true, content: COOLDOWN.error.syntax })

                    await client.database.updateGuild(interaction.guildId, {
                        votingCooldown: voting
                    }, true)

                    const votingembed = new EmbedBuilder()
                        .setColor("#2f3037")
                        .setDescription(`${COOLDOWN.embed.votingSuccess}\`${timeStamp}\``);
                    await interaction.reply({
                            embeds: [votingembed],
                            ephemeral: true,
                        })
                        .catch((err) => {

                        });
                    break;
            }
        } else {
            const errorembed = new EmbedBuilder()
                .setColor("#F00505")
                .setTitle("Error!")
                .setDescription(REPLAY.embed.missingPerms);

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
