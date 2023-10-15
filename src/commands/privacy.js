const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("privacy")
        .setDescription("Change the users privacy settings.")
        .setDMPermission(false)
        .setDescriptionLocalizations({
            de: "Ändere die Datenschutzeinstellungen des Nutzers.",
            "es-ES": "Ajusta la configuración de privacidad del usuario.",
            fr: "Modifiez les paramètres de confidentialité de l'utilisateur.",
        })
        .addStringOption((option) =>
            option
                .setName("votes")
                .setDescription("Select if you want your name to be mentioned in results of votes.")
                .setRequired(true)
                .addChoices(
                    { name: "On", value: "On" },
                    { name: "Off", value: "Off" },
                ),
        ),
    /**
     * @param {CommandInteraction} interaction
     * @param {WouldYou} client
     * @param {guildModel} guildDb
     */

  async execute(interaction, client, guildDb) {
    const choice = interaction.options.get("votes");

    await client.database.updateUser(interaction.user.id, {
      votePrivacy: choice.value === "On" ? true : false,
    });

    interaction.reply({
      content: client.translation.get(guildDb?.language, "Privacy.success", {
        choice: choice.value,
      }),
      ephemeral: true,
    });
  },
};
