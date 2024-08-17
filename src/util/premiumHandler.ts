import { Model } from "mongoose";
import { GuildModel, IGuildModel } from "./Models/guildModel";
import WouldYou from "./wouldYou";

export default class PremiumHandler {
  private guildModel: Model<IGuildModel>;
  private client: WouldYou;
  constructor(client: WouldYou) {
    this.client = client;
    this.guildModel = GuildModel;
  }

  async check(guildId: string | null) {
    const guild = await GuildModel.findOne({ guildID: guildId });

    if (
      guild?.premiumExpiration &&
      guild?.premiumExpiration.getTime() < Date.now()
    ) {
      guild.premium = 0;
      guild.premiumExpiration = null;
      guild.premiumUser = null;
      await guild.save();

      return {
        result: false,
        type: ":x:",
        rawType: 0,
        expiration: null,
        user: null,
      };
    }

    if (guild?.premium == 1)
      return {
        result: true,
        type: this.client.translation.get(
          guildId!,
          `Premium.tier${guild?.premium}`,
        ),
        rawType: guild?.premium,
        expiration: guild?.premiumExpiration,
        user: guild?.premiumUser,
      };
    else
      return {
        result: false,
        type: ":x:",
        rawType: 0,
        expiration: guild?.premiumExpiration,
        user: guild?.premiumUser,
      };
  }
}
