const { ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "dailyRole",
    description: "Daily Role",
  },
  async execute(interaction, client, guildDb) {
    const inter = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("selectMenuRole")
        .setPlaceholder("Select a role")
    );

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.dailyRole"),
      components: [inter],
      ephemeral: true,
    });
  },
};
