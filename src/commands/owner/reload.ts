import { readdirSync } from "fs";
import { captureException } from "@sentry/node";
import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../models";
const cat = readdirSync(`./src/commands/`).filter((d) => d.endsWith(".js"));

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads slash commands.")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Lädt slash commands neu.",
      "es-ES": "Recargar los slash commands.",
      fr: "Recharge une commande",
    })
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Choose which command you want to reload.")
        .setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   */

  execute: async (interaction, client) => {
    // Using deferReply here gives the bot more time to reload the command and reply to the interaction
    await interaction.deferReply({ ephemeral: true });

    const users = [
      "268843733317976066",
      "347077478726238228",
      "834549048764661810",
    ];
    if (!users.find((e) => e === interaction.user.id)) {
      interaction.editReply({
        content:
          "Only Would You develpers have access to this command! | Nur Would You Entwickler haben Zugriff auf diesen Befehl!",
      });
      return;
    }
    const cmd = interaction.options.getString("options") as string;
    if (!cat.find((e) => e.replace(".js", "") === cmd.toLowerCase())) {
      interaction.editReply({
        content: "You must provide a valid command to reload it!",
      });
      return;
    }

    try {
      delete require.cache[require.resolve(`./${cmd}.js`)];
      const pull = require(`./${cmd}.js`);
      client.commands.delete(cmd);
      client.commands.set(cmd, pull);
      interaction.editReply({
        content: `Successfully reloaded command \`${cmd}\`!`,
      });
      return;
    } catch (err: any) {
      captureException(err);
      interaction.editReply({
        content: `Errored reloading command: \`${cmd}\`!\nError: ${err.message}`,
      });
      return;
    }
  },
};

export default command;
