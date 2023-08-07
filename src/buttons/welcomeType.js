const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "welcomeType",
    description: "Welcome Type",
  },
  async execute(interaction, client, guildDb) {
    const inter = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("selectMenuWelcomeType")
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
      content: client.translation.get(
        guildDb?.language,
        "Settings.welcomeType",
      ),
      components: [inter],
      ephemeral: true,
    });
  },
};
