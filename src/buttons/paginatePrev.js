const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "paginatePrev",
    description: "Paginate Prev",
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

    if (paginate.pages.length === 1) return interaction.reply({
      content: client.translation.get(
        guildDb?.language,
        "wyCustom.error.noPages",
      ),
      ephemeral: true,
    });

    if (paginate.page - 1 === 0) {
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

      clearTimeout(paginate.timeout);
      const time = setTimeout(() => {
        if (client.paginate.get(this.user)) client.paginate.delete(this.user);
      }, paginate.time);
      paginate.timeout = time;

      return await interaction.update({
        embeds: [paginate.pages[--paginate.page]],
        components: [buttons],
        ephemeral: true,
      });
    } else {
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
          .setCustomId("paginateNext")
          .setLabel("▶️")
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("paginateLast")
          .setLabel("⏩")
          .setStyle("Secondary"),
      );

      clearTimeout(paginate.timeout);
      const time = setTimeout(() => {
        if (client.paginate.get(this.user)) client.paginate.delete(this.user);
      }, paginate.time);
      paginate.timeout = time;

      return await interaction.update({
        embeds: [paginate.pages[--paginate.page]],
        components: [buttons],
        ephemeral: true,
      });
    }
  },
};