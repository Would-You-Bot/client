import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import WouldYou from "./wouldYou";

export default class Paginator {
  private pages: any[];
  private client: any;
  private user: any;
  private page: number;
  private timeout: number;
  
  constructor({ user, client, timeout }:  {user: any, client: WouldYou, timeout: any}) {
    this.pages = [];
    this.client = client;
    this.user = user;
    this.page = 0;
    this.timeout = timeout;
  }

  add(page: any) {
    if (page.length) {
      this.pages.push(page);
      return this;
    }
    this.pages.push(page);
    return this;
  }

  async start(interaction: any) {
    if (!this.pages.length) return;

    var pFirst = new ButtonBuilder()
    .setDisabled(true)
    .setCustomId("paginateFirst")
    .setLabel("⏪")
    .setStyle(ButtonStyle.Secondary);
    var pPrev = new ButtonBuilder()
    .setDisabled(true)
    .setCustomId("paginatePrev")
    .setLabel("◀️")
    .setStyle(ButtonStyle.Secondary);
    var pNext = new ButtonBuilder()
    .setCustomId("paginateNext")
    .setLabel("▶️")
    .setStyle(ButtonStyle.Secondary);
    var pLast = new ButtonBuilder()
    .setCustomId("paginateLast")
    .setLabel("⏩")
    .setStyle(ButtonStyle.Secondary);

    const buttons = new ActionRowBuilder().addComponents(pFirst, pPrev, pNext, pLast);

    for (let i = 0; i < this.pages.length; i++) {
      const e = this.pages[i];
      e.data.footer = {
        text: `Would You | Page ${i + 1} / ${this.pages.length}`,
        iconURL: this.client.user.avatarURL(),
      };
    }
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
