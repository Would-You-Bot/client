const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = class Paginator {
  constructor({ user, client, timeout }) {
    this.pages = [];
    this.client = client;
    this.user = user;
    this.page = 0;
    this.timeout = timeout;
  }

  add(page) {
    if (page.length) {
      this.pages.push(page);
      return this;
    }
    this.pages.push(page);
    return this;
  }

  async start(interaction) {
    if (!this.pages.length) return;

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

    this.pages.forEach((e, i = 0) => {
      e.data.footer = {
        text: `Would You | Page ${i + 1} / ${this.pages.length}`,
        iconURL: this.client.user.avatarURL(),
      };
    });
    const message = await interaction.reply({
      embeds: [this.pages[0]],
      components: [buttons],
      ephemeral: true,
    });
    this.client.paginate.set(this.user, {
      pages: this.pages,
      page: this.page,
      message: message.id,
      channel: interaction.channel.id,
      timeout: null,
      time: this.timeout,
    });
    const time = setTimeout(() => {
      if (this.client.paginate.get(this.user))
        this.client.paginate.delete(this.user);
    }, this.timeout);
    this.client.paginate.get(this.user).timeout = time;
  }
};
