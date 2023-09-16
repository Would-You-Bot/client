const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Sentry = require("@sentry/node");
const { version } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about the bot.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Zeigt einige Informationen über den Bot.",
      "es-ES": "Muestra información sobre el bot.",
      fr: "Affiche des informations sur le bot",
    }),
  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  async execute(interaction, client, guildDb) {
    const unixstamp =
      Math.floor((Date.now() / 1000) | 0) - Math.floor(client.uptime / 1000);

    function round(num) {
      const m = Number((Math.abs(num) * 100).toPrecision(15));
      return (Math.round(m) / 100) * Math.sign(num);
    }

    console.log("Would You Stats: \n");
    console.log(`Guilds: ${client.guilds.cache.size}`);
    console.log(`Users: ${client.users.cache.size}`);
    console.log(
      `Guild Members: ${client.guilds.cache.reduce(
        (acc, guild) => acc + guild.members.cache.size,
        0,
      )}`,
    );
    console.log(`Channels: ${client.channels.cache.size}`);
    console.log(
      `Roles: ${client.guilds.cache.reduce(
        (acc, guild) => acc + guild.roles.cache.size,
        0,
      )}`,
    );
    console.log(
      `VoiceStates: ${client.guilds.cache.reduce(
        (acc, guild) => acc + guild.voiceStates.cache.size,
        0,
      )}`,
    );
    console.log(
      `Presences: ${client.guilds.cache.reduce(
        (acc, guild) => acc + guild.presences.cache.size,
        0,
      )}`,
    );
    console.log(
      `RAM Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        0,
      )}/${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB`,
    );
    console.log("\n");

    const infoEmbed = new EmbedBuilder()
      .setColor("#5865f4")
      .setTitle("Bot Info")
      .addFields(
        {
          name: "Developers 🐧",
          value: "```@dominikdev\n@forgetfulskybro\n@finndev```",
          inline: false,
        },
        {
          name: "Guilds 🏢",
          value: `\`\`\`${client.guilds.cache.size}\`\`\``,
          inline: true,
        },
        {
          name: "Users 🐧",
          value: `\`\`\`${client.guilds.cache
            .reduce((a, b) => a + b.memberCount, 0)
            .toLocaleString()}\`\`\``,
          inline: true,
        },
        {
          name: "Memory 🎇",
          value: `\`\`\`${round(
            process.memoryUsage().heapUsed / 1000000000,
          )}GB\n\`\`\``,
          inline: true,
        },
        {
          name: "Last Restart 🚀",
          value: `
          <t:${unixstamp}:R>`,
          inline: true,
        },
        {
          name: "Bot Version 🧾",
          value: `\`\`\`v${version}\`\`\``,
          inline: true,
        },
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text:
          interaction.user.tag + " Shard #" + interaction?.guild?.shardId ?? 0,
        iconURL: client.user.avatarURL(),
      })

    interaction
      .reply({ embeds: [infoEmbed], ephemeral: false })
      .catch((err) => {
        Sentry.captureException(err);
      });
  },
};
