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
            de: 'Zeigt den Ping des Clients an',
            "es-ES": 'Muestra el ping del cliente'
        }),

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @param {guildModel} guildDb
     */
    async execute(interaction, client, guildDb) {

        const text1 = interaction.options.getString('first');
        const text2 = interaction.options.getString('second');

        const Canvas = require("@napi-rs/canvas");
        const canvas = Canvas.createCanvas(600, 300);
        const ctx = canvas.getContext("2d");

        const image = await Canvas.loadImage("./src/data/images/template.png");
        await ctx.drawImage(image, 0, 0, 600, 300);

    let imageFile = "./src/data/images/rather-en.png";
    switch (guildDb.language) {
        case "de_DE":
            imageFile = "./src/data/images/rather-de.png";
            break;
        case "en_EN":
            imageFile = "./src/data/images/rather-en.png";
            break;
        case "es_ES":
            imageFile = "./src/data/images/rather-es.png";
            break;
    }
    const translation = await Canvas.loadImage(imageFile);
    ctx.drawImage(translation, 0, 0, 600, 300);

    function calcFontSize(textLength, fontSize, maxLength){
        let size = fontSize
        while(textLength > maxLength) {
            console.log(textLength)
            size--
            return size
        }
        }

        const fontsize1 = calcFontSize(ctx.measureText(text1).width, 15, 180)
        const fontsize2 = calcFontSize(ctx.measureText(text2).width, 15, 180)


        ctx.font = `bold ${fontsize1 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(text1, 140, 158);

        ctx.font = `bold ${fontsize2 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(text2, 140, 242);


        attachment = new AttachmentBuilder(
            await canvas.encode("png"),
            {
                name: "wouldyou-card.png",
            })
        interaction
            .reply({
                files: [attachment],
            })
            .catch((err) => console.log(err));
    }
};
