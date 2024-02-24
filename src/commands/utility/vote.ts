import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { captureException } from "@sentry/node";
import { ChatInputCommand } from "../../interfaces";

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
      .addFields({
        name: "Wumpus.store",
        value: `> [ ${client.translation.get(
          guildDb?.language,
          "Vote.embed.value",
        )}  ](https://wumpus.store/bot/981649513427111957/vote)`,
        inline: true,
      })
      .setThumbnail(client.user?.displayAvatarURL() || "")
      .setFooter({
        text: client.translation.get(guildDb?.language, "Vote.embed.footer"),
        iconURL: client?.user?.displayAvatarURL() || undefined,
      });

    interaction
      .reply({
        embeds: [votemebed],
      })
      .catch((err) => {
        captureException(err);
      });
    return;
  },
};

export default command;
