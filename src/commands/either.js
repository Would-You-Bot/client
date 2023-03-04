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
        .setName('either')
        .setDescription('Generate a custom canvas image')
        .setDMPermission(false)
        .addSubcommand((subcommand) => subcommand
            .setName('message')
            .setDescription('Custom would you rather message image')
            .addStringOption((option) => option
                .setRequired(false)
                .setName('first')
                .setDescription('Text for the first option'))
            .addStringOption((option) => option
                .setRequired(false)
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
        let text1;
        let text2;

        if (!interaction.options.getString('first')) {
            text1 = "random first text"
        } else {
            text1 =
                interaction.options.getString('first').length > 48 ? interaction.options.getString('first').substring(0, 48).trim() + '...' : interaction.options.getString('first');
        }
        if (!interaction.options.getString('second')) {
            text2 = "random second text"
        } else {

            text2 =
                interaction.options.getString('second').length > 48 ? interaction.options.getString('second').substring(0, 48).trim() + '...' : interaction.options.getString('second');
        }

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

        function calcFontSize(textLength, fontSize, maxLength) {
            let size = fontSize
            while (textLength > maxLength) {
                size--
                return size
            }
        }

        const fontsize1 = calcFontSize(ctx.measureText(text1).width, 15, 180)
        const fontsize2 = calcFontSize(ctx.measureText(text2).width, 15, 180)


        ctx.font = `bold ${fontsize1 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(text1, 140, 156);

        ctx.font = `bold ${fontsize2 || "25"}px sans-serif`;
        ctx.fillStyle = "#000000";
        ctx.fillText(text2, 140, 240);

        var rad = 15;

        let users = ["https://cdn.discordapp.com/avatars/981649513427111957/af5f8264403034530bba73ba6c2492d9.webp?size=512", "https://cdn.discordapp.com/avatars/347077478726238228/3b77f755fa8e66fd75d1e2d3fb8b1611.webp?size=512", "https://cdn.discordapp.com/avatars/347077478726238228/3b77f755fa8e66fd75d1e2d3fb8b1611.webp?size=512", "https://cdn.discordapp.com/avatars/347077478726238228/3b77f755fa8e66fd75d1e2d3fb8b1611.webp?size=512"]

        const sliced = users.slice(0, 3)

        var pos = rad * sliced.length + 430;
        var yPos = 162;
        sliced.reverse();


        for (let i = 0; i < sliced.length; i++) {
            ctx.beginPath();
            let user = sliced[i]; // user == interaction.user.displayAvatarURL({ format: 'jpg' })

            const a = Canvas.createCanvas(rad * 2, rad * 2);
            const context = a.getContext("2d");

            context.beginPath();
            context.arc(rad, rad, rad, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(user);
            context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

            ctx.drawImage(a, pos, yPos);

            ctx.closePath();
            pos -= rad;
        }

        let users2 = ["https://cdn.discordapp.com/avatars/981649513427111957/af5f8264403034530bba73ba6c2492d9.webp?size=512", "https://cdn.discordapp.com/avatars/347077478726238228/3b77f755fa8e66fd75d1e2d3fb8b1611.webp?size=512"]

        const sliced2 = users2.slice(0, 3)

        var pos1 = rad * sliced2.length + 430;
        var yPos1 = 248;
        sliced2.reverse();


        for (let i = 0; i < sliced2.length; i++) {
            ctx.beginPath();
            let user = sliced2[i]; // user == interaction.user.displayAvatarURL({ format: 'jpg' })

            const a = Canvas.createCanvas(rad * 2, rad * 2);
            const context = a.getContext("2d");

            context.beginPath();
            context.arc(rad, rad, rad, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(user);
            context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

            ctx.drawImage(a, pos1, yPos1);

            ctx.closePath();
            pos1 -= rad;
        }


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
