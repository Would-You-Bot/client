import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import Sentry from "@sentry/node";
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Link to our support server")
    .setDMPermission(true)
    .setDescriptionLocalizations({
      de: "Link zu unserem Support Server",
      "es-ES": "Link para nuestro servidor de soporte",
      fr: "Lien vers notre serveur d'assistance",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const supportembed = new EmbedBuilder()
      .setColor("#F00505")
      .setTitle(
        client.translation.get(guildDb?.language, "Support.embed.title"),
      )
      .setDescription(
        client.translation.get(guildDb?.language, "Support.embed.description"),
      )
      .setFooter({
        text: client.translation.get(guildDb?.language, "Support.embed.footer"),
        iconURL: client.user?.avatarURL() || undefined,
      })
      .setTimestamp();

    const supportbutton = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle(5)
        .setEmoji("💻")
        .setURL("https://discord.gg/vMyXAxEznS"),
    );

    interaction
      .reply({
        embeds: [supportembed],
        components: [supportbutton],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
      return;
  },
};

export default command;