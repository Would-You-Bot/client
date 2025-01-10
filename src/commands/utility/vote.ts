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
    .setDescription("Displays the link to vote for the bot")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescriptionLocalizations({
      de: "Zeigt den Link zum Abstimmen für den Bot an",
      "es-ES": "Muestra el enlace para votar por el bot",
      fr: "Affiche le lien pour voter pour le bot",
      it: "Mostra il link per votare per il bot",
    }),

  execute: async (interaction, client, guildDb) => {
    const { topgg } = client.config.emojis.vote;

    const voteEmbed = new EmbedBuilder()
      .setAuthor({
        name: client.translation.get(guildDb?.language, "Vote.embed.name"),
        iconURL: `https://cdn.discordapp.com/emojis/${topgg}.webp?size=512&quality=lossless`,
      })
      .setColor("#FF3366")
      .setDescription(
        client.translation.get(guildDb?.language, "Vote.embed.description"),
      );

    const button =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(
            client.translation.get(guildDb?.language, "Vote.button.label"),
          )
          .setStyle(5)
          .setEmoji(topgg)
          .setURL("https://top.gg/bot/981649513427111957/vote/"),
      );
    await interaction
      .reply({
        embeds: [voteEmbed],
        components: [button],
        ephemeral: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
