import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommand } from "../../interfaces";
const { version } = require("../../../package.json");

const command: ChatInputCommand = {
  requireGuild: true,
  cooldown: true,
  data: new SlashCommandBuilder()
    .setName("invalidkiller")
    .setDescription("Invalidates your killer")
    .setContexts([0])
    .setIntegrationTypes([0]),

  execute: async (interaction, client, guildDb) => {
    if(interaction.user.id !== "347077478726238228") {
      return interaction.reply({ content: "You are not allowed to use this command", ephemeral: true });
    }
    const killer = await client.users.fetch("572898352040247309");
    killer.send("hello this is a fancy dm")
  }
}

export default command;
