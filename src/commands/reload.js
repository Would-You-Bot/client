const { readdirSync } = require("fs");
const Sentry = require("@sentry/node");
const {
  SlashCommandBuilder,
} = require("discord.js");
const cat = readdirSync(`./src/commands/`).filter((d) => d.endsWith(".js"));
module.exports = {
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
        .setRequired(true),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   */

  async execute(interaction, client) {
    // Using deferReply here gives the bot more time to reload the command and reply to the interaction
    await interaction.deferReply({ ephemeral: true });

    const users = [
      "268843733317976066",
      "347077478726238228",
      "834549048764661810",
    ];
    if (!users.find((e) => e === interaction.user.id))
      return interaction.editReply({
        content:
          "Only Would You develpers have access to this command! | Nur Would You Entwickler haben Zugriff auf diesen Befehl!",
      });
    const cmd = interaction.options.getString("options");
    if (!cat.find((e) => e.replace(".js", "") === cmd.toLowerCase()))
      return interaction.editReply({
        content: "You must provide a valid command to reload it!",
      });

    try {
      delete require.cache[require.resolve(`./${cmd}.js`)];
      const pull = require(`./${cmd}.js`);
      client.commands.delete(cmd);
      client.commands.set(cmd, pull);
      return interaction.editReply({
        content: `Successfully reloaded command \`${cmd}\`!`,
      });
    } catch (err) {
      Sentry.captureException(err);
      return interaction.editReply({
        content: `Errored reloading command: \`${cmd}\`!\nError: ${err.message}`,
      });
    }
  },
};
