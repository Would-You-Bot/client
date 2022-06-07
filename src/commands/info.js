const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version: djsversion } = require("discord.js");

const os = require("os");
const Guild = require("../util/Models/guildModel");
const { version } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows some information about the bot."),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then(async (result) => {
      const { Info } = require(`../languages/${result.language}.json`);
      const botJoinInt = result.botJoined;

      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      const core = os.cpus()[0];

      const infoEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.avatarURL(),
        })
        .setColor("#5865f4")
        .setTitle("Bot Info")
        .setThumbnail(client.user.displayAvatarURL())
        .addField(
          "> General",
          [
            "**<:right:983796624566399036>  Dev Team:** [Developers Dungeon Studios](https://developersdungeon.xyz/)",
            "**<:right:983796624566399036>  Discord:** [Server Invite](https://discord.gg/KfBkKKydfg)",
            "**<:right:983796624566399036>  Client:** [Bot Invite](https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands)",
            `**<:right:983796624566399036>  Servers:** ${client.guilds.cache.size.toLocaleString()} `,
            `${Info.embed.name1} <t:${botJoinInt}:f>`,
            `**<:right:983796624566399036>  Users:** ${client.guilds.cache
              .reduce((a, b) => a + b.memberCount, 0)
              .toLocaleString()}`,
            `**<:right:983796624566399036>  Channels:** ${client.channels.cache.size.toLocaleString()}`,
            `${Info.embed.name2}`,
            `**<:right:983796624566399036>  Bot Version:** v${version}`,
            `**<:right:983796624566399036>  Node.js:** ${process.version}`,
            `**<:right:983796624566399036>  Discord.js:** v${djsversion}`,
          ].join("\n")
        )
        .addField(
          "> System",
          [
            `**<:right:983796624566399036>  Platform:** ${process.platform}`,
            `**<:right:983796624566399036>  Uptime:** ${`${days}d ${hours}h ${minutes}m ${seconds}s`}`,
            "**<:right:983796624566399036>  CPU:**",
            `<:right:983796624566399036>  Cores: ${os.cpus().length}`,
            `<:right:983796624566399036>  Threads: ${os.cpus().length * 2}`,
            `<:right:983796624566399036>  Model: ${core.model}`,
            `<:right:983796624566399036>  Base Speed: ${core.speed}MHz`,
          ].join("\n")
        )

        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true }),
        })
        .setTimestamp();

      interaction.reply({ embeds: [infoEmbed], ephemeral: false });
    });
  },
};
