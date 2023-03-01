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

        const text1 =
        interaction.options.getString('first').length > 48 ?  interaction.options.getString('first').substring(0, 48).trim() + '...' :  interaction.options.getString('first');

        const text2 =
        interaction.options.getString('second').length > 48 ?  interaction.options.getString('second').substring(0, 48).trim() + '...' :  interaction.options.getString('second');

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

        for (let i = 0; i < users.length; i++) {
			ctx.beginPath();
			let user = users[i]; // user == interaction.user.displayAvatarURL({ format: 'jpg' })

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
