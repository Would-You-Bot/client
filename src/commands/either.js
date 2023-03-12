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
            .setVotes(["https://cdn.discordapp.com/avatars/981649513427111957/af5f8264403034530bba73ba6c2492d9.webp?size=512"], ["https://cdn.discordapp.com/avatars/981649513427111957/af5f8264403034530bba73ba6c2492d9.webp?size=512"])

        if (!interaction.options.getString('first')) {
            eitherImage.addFirstText("Sus")
        } else {
            eitherImage.addFirstText(interaction.options.getString('first').length > 48 ? interaction.options.getString('first').substring(0, 48).trim() + '...' : interaction.options.getString('first'));
        }
        if (!interaction.options.getString('second')) {
            eitherImage.addSecondText("Sus 2", "s")
        } else {
            eitherImage.addSecondText(interaction.options.getString('second').length > 48 ? interaction.options.getString('second').substring(0, 48).trim() + '...' : interaction.options.getString('second'));
        }

        const attachment = new AttachmentBuilder(await eitherImage.build(), { name: 'wouldyoubot-either.png' })

        interaction
            .reply({
                files: [attachment],
            })
            .catch((err) => console.log(err));
    }
};
