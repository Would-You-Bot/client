import { captureException } from "@sentry/node";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../interfaces";
const { version } = require("../../../package.json");

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Gives you information about the bot")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Zeigt einige Informationen über den Bot",
      "es-ES": "Muestra información sobre el bot",
      fr: "Affiche des informations sur le bot",
      it: "Mostra alcune informazioni sul bot",
    }),

  execute: async (interaction, client, guildDb) => {
    const serverCount = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size,
    );

    const userCount = await client.cluster.broadcastEval((c) =>
      c.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    );
    let ramUsage = await client.cluster.broadcastEval(() => {
      function round(num: number) {
        const m = Number((Math.abs(num) * 100).toPrecision(15));
        return (Math.round(m) / 100) * Math.sign(num);
      }

      return round(process.memoryUsage().heapUsed / 1000000000);
    });

    const unixstamp =
      Math.floor(Date.now() / 1000) - Math.floor((client.uptime || 0) / 1000);

    const premium = await client.premium.check(interaction.guildId);

    let premiumEmoji = premium.result ? "✅" : "❌";

    const { dominik, sky, skelly, paul, paulos } = client.config.emojis.info;

    const infoEmbed = new EmbedBuilder()
      .setColor("#5865f4")
      .setTitle("Bot Info")
      .addFields(
        {
          name: "Developers:",
          value: `${dominik + sky + skelly + paul + paulos}`,
          inline: false,
        },
        {
          name: "Servercount:",
          value: `${serverCount.reduce((prev, val) => prev + val, 0).toLocaleString()}`,
          inline: false,
        },
        {
          name: "Users:",
          value: `${userCount.reduce((a, b) => a + b, 0).toLocaleString()}`,
          inline: false,
        },
        {
          name: "Memory:",
          value: `${ramUsage.reduce((acc, usage) => acc + usage, 0).toLocaleString()}GB`,
          inline: false,
        },
        {
          name: "Last Restart:",
          value: `
          <t:${unixstamp}:R>`,
          inline: false,
        },
        {
          name: "Bot Version:",
          value: `v${version}`,
          inline: false,
        },
        {
          name: "Premium Server:",
          value: `${premiumEmoji + " " + premium.result}`,
          inline: false,
        },
      )
      .setThumbnail(
        client.user?.displayAvatarURL() || "https://wouldyoubot.gg/Logo.png",
      )
      .setFooter({
        text:
          interaction.user.tag +
          " |" +
          " Shard #" +
          interaction?.guild?.shardId +
          " |" +
          " Cluster #" +
          client.cluster.id,
        iconURL:
          client?.user?.displayAvatarURL() || "https://wouldyoubot.gg/Logo.png",
      });

    interaction
      .reply({ embeds: [infoEmbed], ephemeral: false })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
