const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { version } = require('../../package.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows some information about the bot.'),
  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const unixstamp = Math.floor((Date.now() / 1000) | 0) - Math.floor(client.uptime / 1000);

    function round(num) {
      const m = Number((Math.abs(num) * 100).toPrecision(15));
      return (Math.round(m) / 100) * Math.sign(num);
    }

    const infoEmbed = new EmbedBuilder()
      .setColor('#5865f4')
      .setTitle('Bot Info')
      .addFields(
        {
          name: 'Developer 🐒',
          value: `
          \`\`\`Mezo#0001\n\`\`\``,
          inline: false,
        },
        {
          name: 'Last Restart 🚀',
          value: `
          <t:${unixstamp}:R>`,
          inline: true,
        },
        {
          name: 'Memory 🎇',
          value: `\`\`\`${round(
            process.memoryUsage().heapUsed / 1000000000,
          )} Used Memory\n\`\`\``,
          inline: true,
        },
        {
          name: 'Guilds 🏢',
          value: `\`\`\`${client.guilds.cache.size} Total Guilds\`\`\``,
          inline: true,
        },
        {
          name: 'User 🐧',
          value: `\`\`\`${client.guilds.cache
            .reduce((a, b) => a + b.memberCount, 0)
            .toLocaleString()} Total Users\`\`\``,
          inline: true,
        },
        {
          name: 'Bot Version 🧾',
          value: `\`\`\`v.${version}\`\`\``,
          inline: true,
        },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: interaction.user.tag,
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp();

    interaction
      .reply({ embeds: [infoEmbed], ephemeral: false })
      .catch((err) => {
        return;
      });
  },
};
