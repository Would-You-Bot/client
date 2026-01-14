import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Gives you information about the bot")
    .setContexts([0])
    .setIntegrationTypes([0])
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

    const ramUsage = await client.cluster.broadcastEval(() => {
      function round(num: number) {
        const m = Number((Math.abs(num) * 100).toPrecision(15));
        return (Math.round(m) / 100) * Math.sign(num);
      }

      return round(process.memoryUsage().heapUsed / 1000000000);
    });

    const unixstamp =
      Math.floor(Date.now() / 1000) - Math.floor((client.uptime || 0) / 1000);

    const premium = await client.premium.check(interaction.guildId);

    const { dominik, sky, skelly, paulos, tee, woofer } =
      client.config.emojis.info;

    const buttons =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Website")
          .setURL("https://wouldyoubot.gg")
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setLabel("Support")
          .setURL("https://discord.com/invite/vMyXAxEznS")
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setLabel("Status")
          .setURL("https://wouldyoubot.gg/status")
          .setStyle(ButtonStyle.Link),
      );

    const infoEmbed = new EmbedBuilder()
      .setColor("#0598F6")
      .setDescription(
        `# Info about Would You
Devs: ${dominik + sky + skelly + paulos + tee + woofer}
Servers: ${serverCount.reduce((prev, val) => prev + val, 0).toLocaleString()} | Users: ${userCount.reduce((a, b) => a + b, 0).toLocaleString()}
Memory: ${ramUsage.reduce((acc, usage) => acc + usage, 0).toLocaleString()}GB | Last Restart: <t:${unixstamp}:R>`,
      )
      .setFooter({
        text: `Server Premium Status: ${premium.result ? premium.rawType : "Free"}`,
        iconURL: "https://wouldyoubot.gg/Logo.png",
      });

    interaction
      .reply({ embeds: [infoEmbed], components: [buttons], ephemeral: false })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
