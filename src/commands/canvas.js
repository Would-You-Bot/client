const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
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
        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext("2d");
        
        // Set background color
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        ctx.font = "48px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Would You Rather?", canvas.width / 2, 50);
        
        // Draw first question
        ctx.font = "36px sans-serif";
        ctx.fillStyle = "blue";
        ctx.textAlign = "left";
        ctx.fillText("Option A", 50, 150);
        
        // Draw second question
        ctx.font = "36px sans-serif";
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        ctx.fillText("Option B", canvas.width - 50, 150);
        
        // Draw separator line
        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(canvas.width, 100);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        
        // Draw circles around the questions
        ctx.beginPath();
        ctx.arc(50, 150, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(canvas.width - 50, 150, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const fs = require("fs");
        const out = fs.createWriteStream(__dirname + "/would-you-rather.png");
        const stream = canvas.toBuffer("image/png");
        out.write(stream);
        out.end();
        
      
    },
};
