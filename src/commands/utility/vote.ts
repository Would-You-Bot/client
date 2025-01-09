import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Checks how fast the bot responds")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescriptionLocalizations({
      de: "Zeigt den Ping des Clients an",
      "es-ES": "Muestra el ping del cliente",
      fr: "Affiche le ping du client",
      it: "Mostra il ping del client",
    }),

  execute: async (interaction, client, guildDb) => {
    const pingembed = new EmbedBuilder()

      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Ping.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Ping.embed.title"))
      .addFields(
        {
          name: client.translation.get(guildDb?.language, "Ping.embed.client"),
          value: `> **${Math.abs(Date.now() - interaction.createdTimestamp)}**ms`,
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Ping.embed.api"),
          value: `> **${Math.round(client.ws.ping)}**ms`,
          inline: false,
        },
      );
    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Ping.button.title"),
          )
          .setStyle(5)
          .setEmoji("💻")
          .setURL("https://discordstatus.com/"),
      );
    await interaction
      .reply({
        embeds: [pingembed],
        components: [button],
        ephemeral: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
