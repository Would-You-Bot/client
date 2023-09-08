const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "paginateLast",
    description: "Paginate last",
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
        .setCustomId("paginateFirst")
        .setLabel("⏪")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setCustomId("paginatePrev")
        .setLabel("◀️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId("paginateNext")
        .setLabel("▶️")
        .setStyle("Secondary"),
      new ButtonBuilder()
        .setDisabled(true)
        .setCustomId("paginateLast")
        .setLabel("⏩")
        .setStyle("Secondary"),
    );

    await interaction.update({
      embeds: [paginate.pages[paginate.pages.length - 1]],
      components: [buttons],
      ephemeral: true,
    });

    clearTimeout(paginate.timeout);
    const time = setTimeout(() => {
      if (client.paginate.get(this.user)) client.paginate.delete(this.user);
    }, paginate.time);
    paginate.timeout = time;

    return (paginate.page = paginate.pages.length - 1);
  },
};
