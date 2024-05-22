import {
  SlashCommandBuilder,
} from "discord.js";
import { captureException } from "@sentry/node";
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

    const premium = await client.premium.check(interaction.guildId)
    console.log(premium)
    
    await interaction
      .reply({
        content: String(premium),
        ephemeral: true,
      })
      .catch((err) => {
        captureException(err);
      });
  },
};

export default command;
