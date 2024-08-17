import { Entitlement } from "discord.js";
import "dotenv/config";
import { Event } from "../interfaces";
import { GuildModel } from "../util/Models/guildModel";
import WouldYou from "../util/wouldYou";

const event: Event = {
  event: "entitlementDelete",
  execute: async (client: WouldYou, entitlement: Entitlement) => {
    if (!entitlement.guildId) return;

    await GuildModel.updateOne(
      { guildID: entitlement.guildId },
      {
        premium: 0,
        premiumExpiration: null,
        premiumUser: null,
      },
    )
  },
   
};

export default event;
