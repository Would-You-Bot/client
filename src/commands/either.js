const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js');
const Either = require("../util/generateEither")
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('either')
        .setDescription('Generate a custom canvas image')
        .setDMPermission(false)
        .addSubcommand((subcommand) => subcommand
            .setName('message')
            .setDescription('Custom would you rather message image')
            .addStringOption((option) => option
                .setRequired(true)
                .setName('first')
                .setDescription('Text for the first option'))
            .addStringOption((option) => option
                .setRequired(true)
                .setName('second')
                .setDescription('Text for the second option')))
        .setDescriptionLocalizations({
            de: 'Erstellt eine Würdest du Eher Karte',
            "es-ES": 'Crea una tarjeta de ¿Qué prefieres?'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {
        const eitherImage = new Either()
            .setLanguage(guildDb.language)
            .setTexts(interaction.options.getString('first'), interaction.options.getString('second'))
            .setVotes([], [])

        const attachment = new AttachmentBuilder(await eitherImage.build(), { name: 'wouldyoubot-either.png' })

        const time = guildDb?.voteCooldown ?? 60_000;
        const three_minutes = 3 * 60 * 1e3;

        const {
            row,
            id
        } = await client.voting.generateVoting(interaction.guildId, interaction.channelId, ~~((Date.now() + time) / 1000), 2, interaction.options.getString('first'), interaction.options.getString('second'));

        const msg = await interaction.reply({
            files: [attachment],
            components: [row],
            fetchReply: true,
        }).catch((err) => {
            console.log(err)
        });

        await client.voting.setVotingMessage(id, msg.id);

        if(time < three_minutes) {
            setTimeout(async () => {
                await client.voting.endVoting(id, msg.id);
            }, time);
        }
    }
};
