import type { Entitlement } from "discord.js";
import "dotenv/config";
import type { Event } from "../interfaces";
import { GuildModel } from "../util/Models/guildModel";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "entitlementUpdate",
  execute: async (
    client: WouldYou,
    oldEntitlement: Entitlement,
    newEntitlement: Entitlement,
  ) => {
    if (!newEntitlement.guildId) return;
    const alreadyHasPremium = await client.premium.check(
      newEntitlement.guildId,
    );

    // Check if the guild already has premium and which expiration date is higher
    if (
      alreadyHasPremium.result === true &&
      alreadyHasPremium.expiration &&
      newEntitlement.endsTimestamp &&
      newEntitlement.endsTimestamp < alreadyHasPremium?.expiration?.getTime()
    )
      return;

    await GuildModel.updateOne(
      { guildID: newEntitlement.guildId },
      {
        premiumExpiration: newEntitlement?.endsTimestamp
          ? new Date(newEntitlement?.endsTimestamp)
          : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    );
  },
};

export default event;
