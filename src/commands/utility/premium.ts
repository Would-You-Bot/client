import { captureException } from "@sentry/node";
import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../interfaces";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("premium")
    .setDescription("Checks shit about premium looool")
    .setDMPermission(false),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const premium = await client.premium.check(interaction.guildId);

    await interaction
      .reply({
        content: `Premium: ${premium.result} \nExpiration: ${premium.expiration} \nUser: ${premium.user}`,
        ephemeral: false,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
