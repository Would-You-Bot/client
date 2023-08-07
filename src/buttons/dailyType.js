const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "dailyType",
    description: "Daily Type",
  },
  async execute(interaction, client, guildDb) {
    const inter = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("selectMenuType")
        .setPlaceholder("Select a type")
        .addOptions([
          {
            label: "Regular",
            value: "regular",
            description: "This changes it to use only default messages.",
          },
          {
            label: "Mixed",
            value: "mixed",
            description:
              "This changes it to use both custom & default messages.",
          },
          {
            label: "Custom",
            value: "custom",
            description: "This changes it to use only custom messages.",
          },
        ]),
    );

    interaction.update({
      content: null,
      embeds: [],
      content: client.translation.get(guildDb?.language, "Settings.dailyType"),
      components: [inter],
      ephemeral: true,
    });
  },
};
