const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "paginateFirst",
    description: "Pagination first",
  },
  async execute(interaction, client, guildDb) {
    const paginate = client.paginate.get(interaction.user.id);
    if (!paginate)
      return interaction.reply({
        content: client.translation.get(
          guildDb?.language,
          "wyCustom.error.issue",
        ),
        ephemeral: true,
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId("paginateFirst")
        .setLabel("⏪")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId("paginatePrev")
        .setLabel("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("paginateNext")
        .setLabel("▶️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("paginateLast")
        .setLabel("⏩")
        .setStyle("Secondary"),
    );

    await interaction.update({
      embeds: [paginate.pages[0]],
      components: [buttons],
      ephemeral: true,
    });

    clearTimeout(paginate.timeout);
    const time = setTimeout(() => {
      if (client.paginate.get(this.user)) client.paginate.delete(this.user);
    }, paginate.time);
    paginate.timeout = time;

    return (paginate.page = 0);
  },
};
