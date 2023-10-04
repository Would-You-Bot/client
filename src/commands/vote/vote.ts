import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Sentry from "@sentry/node";
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for me!")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Stimme für mich ab!",
      "es-ES": "¡Vota por mí!",
      fr: "Votez pour le bot pour nous soutenir",
    }),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const votemebed = new EmbedBuilder()
      .setColor("#5865f4")
      .setTitle(client.translation.get(guildDb?.language, "Vote.embed.title"))
      .addFields(
        {
          name: "Top.gg",
          value: `> [ ${client.translation.get(
            guildDb?.language,
            "Vote.embed.value",
          )}  ](https://top.gg/bot/981649513427111957/vote)`,
          inline: true,
        },
        {
          name: "Voidbots",
          value: `> [ ${client.translation.get(
            guildDb?.language,
            "Vote.embed.value",
          )}  ](https://voidbots.net/bot/981649513427111957)`,
          inline: true,
        },
      )
      .setThumbnail(client.user?.displayAvatarURL() || "")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Vote.embed.footer"),
        iconURL: client.user?.avatarURL() || undefined,
      });

    interaction
      .reply({
        embeds: [votemebed],
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
    return;
  },
};

export default command;
