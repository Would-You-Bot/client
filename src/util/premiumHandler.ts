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
    const guild = await this.client.database.getGuild(
      guildId || "",
      true,
      true,
    );
    if (guild?.premium === 0) return { result: false, type: ":x:", rawType: 0 };
    else
      return {
        result: true,
        type: this.client.translation.get(
          guildId || "",
          `Premium.tier${guild?.premium}`,
        ),
        rawType: guild?.premium,
      };
  }

  async update(guildId: string, data: object) {
    try {
      const guild = await this.client.database.getGuild(guildId);
      await this.client.database.updateGuild(guildId || "", {
        ...guild,
        data,
      });
      return { result: true, error: false };
    } catch (e: any) {
      return { result: false, error: e.message };
    }
  }
}
