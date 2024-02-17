import { GuildModel, IGuildModel } from "./Models/guildModel";
import WouldYou from "./wouldYou";
import { Model } from "mongoose";

export default class PremiumHandler {
  private guildModel: Model<IGuildModel>;
  private client: WouldYou;
  constructor(client: WouldYou) {
    this.client = client;
    this.guildModel = GuildModel;
  }

  async check(guildId: string | null) {
    const db = await this.guildModel.findOne({ guildID: guildId });
    if (db && db.premium) return true;
    else return false;
  }
}
