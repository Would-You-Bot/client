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


        ctx.font = `bold ${text1 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText("only eat banana uwu sus hehe", 140, 159);

        ctx.font = `bold ${tex2 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText("or only eat apples", 140, 243);


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
