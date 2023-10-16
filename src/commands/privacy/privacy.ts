import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../models";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("privacy")
    .setDescription("Privacy settings")
    .setDMPermission(false)
    .setDescriptionLocalizations({
      de: "Lorem ipsum",
      "es-ES": "Lorem ipsum",
      fr: "Lorem ipsum",
    })
    .addStringOption((option) =>
      option
        .setName("votes")
        .setDescription(
          "Select if you want your name to be mentioned in results of votes.",
        )
        .setRequired(true)
        .addChoices({ name: "On", value: "On" }, { name: "Off", value: "Off" }),
    ),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {IGuildModel} guildDb
   */

  execute: async (interaction, client, guildDb) => {
    const choice = interaction.options.get("votes");

    await client.database.updateUser(interaction.user.id, {
      votePrivacy: choice?.value === "On" ? true : false,
    });

    await interaction.reply({
      content: client.translation.get(guildDb?.language, "Privacy.success", {
        choice: choice?.value,
      }),
      ephemeral: true,
    });
  },
};

export default command;
