const {
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
} = require("discord.js");
module.exports = {
  data: {
    name: "dailyRole",
    description: "Daily Role",
  },
  async execute(interaction, client, guildDb) {
    let inter;
    let inter2;
    if (guildDb?.dailyRole) {
      (inter = new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      )),
        (inter2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("deleteDailyRole")
            .setLabel("Delete Daily Role")
            .setStyle("Danger"),
        ));
    } else {
      inter = new ActionRowBuilder().addComponents(
        new RoleSelectMenuBuilder()
          .setCustomId("selectMenuRole")
          .setPlaceholder("Select a role"),
      );
    }

    interaction.update({
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.dailyRole"),
      components: guildDb?.dailyRole ? [inter, inter2] : [inter],
      ephemeral: true,
    });
  },
};
