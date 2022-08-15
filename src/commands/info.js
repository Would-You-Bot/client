const {
  CommandInteraction,
  Client,
  EmbedBuilder,
  SlashCommandBuilder,
  version: djsversion,
} = require("discord.js");

const os = require("os");
const Guild = require("../util/Models/guildModel.js");
const { version } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows some information about the bot."),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then(async (result) => {
      const { Info } = require(`../languages/${result.language}.json`);

      const days = Math.floor(client.uptime / 86400000);
      const hours = Math.floor(client.uptime / 3600000) % 24;
      const minutes = Math.floor(client.uptime / 60000) % 60;
      const seconds = Math.floor(client.uptime / 1000) % 60;

      const infoEmbed = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle("Bot Info")
        .addFields(
          {
            name: "Uptime 🚀",
            value: `
          \`\`\`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\n\`\`\``,
            inline: true,
          },
          {
            name: "Memory 🎇",
            value: `\`\`\`${round(
              process.memoryUsage().heapUsed / 1000000000
            )} Used Memory\n\`\`\``,
            inline: true,
          },
          {
            name: "Guilds 🏢",
            value: `\`\`\`${client.guilds.cache.size} Total Guilds\`\`\``,
            inline: true,
          },
          {
            name: "Users 🐧",
            value: `\`\`\`${client.guilds.cache
              .reduce((a, b) => a + b.memberCount, 0)
              .toLocaleString()} Total Users\`\`\``,
            inline: true,
          },
          {
            name: "Bot Version 🧾",
            value: `\`\`\`v.${version}\`\`\``,
            inline: true,
          }
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();

      interaction.reply({ embeds: [infoEmbed], ephemeral: false });
    });
  },
};

function round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}