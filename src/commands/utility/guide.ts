import { captureException } from "@sentry/node";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Shows you how to use the bot")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setDescriptionLocalizations({
      de: "Anleitung, um den Bot zu verwenden und die Aktivität zu erhöhen",
      "es-ES": "Guía para usar el bot y aumentar la actividad",
      fr: "Un guide simple sur la façon d'utiliser le bot pour augmenter l'activité",
      it: "Guida su come utilizzare il bot e aumentare l'attività",
    }),

  execute: async (interaction, client, guildDb) => {
    const guideembed = new EmbedBuilder()
      .setColor("#0598F6")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Guide.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      })
      .setTimestamp()
      .setTitle(client.translation.get(guildDb?.language, "Guide.embed.title"))
      .addFields(
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name1"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value1",
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name2"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value2",
          ),
          inline: false,
        },
        {
          name: client.translation.get(guildDb?.language, "Guide.embed.name3"),
          value: client.translation.get(
            guildDb?.language,
            "Guide.embed.value3",
          ),
          inline: false,
        },
      )
      .setImage("https://i.imgur.com/nA0yA0V.png")
      .setDescription(
        client.translation.get(guildDb?.language, "Guide.embed.description"),
      );

    await interaction
      .reply({
        embeds: [guideembed],
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
