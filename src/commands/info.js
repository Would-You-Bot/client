const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, version: djsversion } = require('discord.js');

const os = require('os');
const Guild = require('../util/Models/guildModel');
const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows some information about the bot.'),
  async execute(interaction, client) {
    Guild.findOne({ id: interaction.guild.id }).then(async (result) => {
      const { Info } = require(`../languages/${result.language}.json`);
      const botJoinInt = result.botJoined;

      const days = Math.floor(client.uptime / 86400000);
      const hours = Math.floor(client.uptime / 3600000) % 24;
      const minutes = Math.floor(client.uptime / 60000) % 60;
      const seconds = Math.floor(client.uptime / 1000) % 60;

      const core = os.cpus()[0];

      let emojiright;
      if (!interaction.guild.me.permissions.has([Permissions.FLAGS.USE_EXTERNAL_EMOJIS])) {
        emojiright = '❯';
      } else {
        emojiright = '<:right:983796624566399036>';
      }

      const infoEmbed = new MessageEmbed()
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.avatarURL(),
        })
        .setColor('#5865f4')
        .setTitle('Bot Info')
        .setThumbnail(client.user.displayAvatarURL())
        .addField(
          '> General',
          [
            `**${emojiright}  Dev Team:** [Developers Dungeon Studios](https://developersdungeon.xyz/)`,
            `**${emojiright}  Discord:** [Server Invite](https://discord.gg/KfBkKKydfg)`,
            `**${emojiright}  Client:** [Bot Invite](https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands)`,
            `**${emojiright}  Servers:** ${client.guilds.cache.size.toLocaleString()} `,
            `${emojiright} ${Info.embed.name1} <t:${botJoinInt}:f>`,
            `**${emojiright}  Users:** ${client.guilds.cache
              .reduce((a, b) => a + b.memberCount, 0)
              .toLocaleString()}`,
            `**${emojiright}  Channels:** ${client.channels.cache.size.toLocaleString()}`,
            `${emojiright}  ${Info.embed.name2}`,
            `**${emojiright}  Bot Version:** v${version}`,
            `**${emojiright}  Node.js:** ${process.version}`,
            `**${emojiright}  Discord.js:** v${djsversion}`,
          ].join('\n'),
        )
        .addField(
          '> System',
          [
            `**${emojiright}  Platform:** ${process.platform}`,
            `**${emojiright}  Uptime:** ${`${days}d ${hours}h ${minutes}m ${seconds}s`}`,
            `**${emojiright}  CPU:**`,
            `${emojiright}  Cores: ${os.cpus().length}`,
            `${emojiright}  Threads: ${os.cpus().length * 2}`,
            `${emojiright}  Model: ${core.model}`,
            `${emojiright}  Base Speed: ${core.speed}MHz`,
          ].join('\n'),
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
