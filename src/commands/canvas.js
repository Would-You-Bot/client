const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js');
const guildModel = require('../util/Models/guildModel');

module.exports = {
    requireGuild: true,
    data: new SlashCommandBuilder()
        .setName('canvas')
        .setDescription('Generate a canvas image')
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: 'Zeigt den Ping des Clients an',
            "es-ES": 'Muestra el ping del cliente'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {

        const Canvas = require("@napi-rs/canvas");
        const canvas = Canvas.createCanvas(600, 300);
        const ctx = canvas.getContext("2d");

        const image = await Canvas.loadImage("./src/data/images/template.png");
        await ctx.drawImage(image, 0, 0, 600, 300);

        if (guildDb.language === "de_DE") {
            const detranslation = await Canvas.loadImage("./src/data/images/rather-de.png")
            ctx.drawImage(detranslation, 0, 0, 600, 300);
        } else if (guildDb.language === "en_EN") {
            const entranslation = await Canvas.loadImage("./src/data/images/rather-en.png")
            ctx.drawImage(entranslation, 0, 0, 600, 300);
        } else if (guildDb.language === "es_ES") {
            const estranslation = await Canvas.loadImage("./src/data/images/rather-es.png")
            ctx.drawImage(estranslation, 0, 0, 600, 300);
        }

        attachment = new AttachmentBuilder(
            await canvas.encode("png"),
            {
                name: "spotify-card.png",
            })
        interaction
            .reply({
                files: [attachment],
            })
            .catch((err) => console.log(err));
    }
};
