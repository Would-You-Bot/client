import { captureException } from "@sentry/node";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Gives you a link to get help")
    .setDMPermission(true)
    .setDescriptionLocalizations({
      de: "Link zu unserem Support Server",
      "es-ES": "Link para nuestro servidor de soporte",
      fr: "Lien vers notre serveur d'assistance",
      it: "Link al nostro server di supporto",
    }),

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
        iconURL: client?.user?.displayAvatarURL() || undefined,
      })
      .setTimestamp();

    const supportbutton =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
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
        captureException(err);
      });
    return;
  },
};

export default command;
