import type { Entitlement } from "discord.js";
import "dotenv/config";
import type { Event } from "../interfaces";
import { GuildModel } from "../util/Models/guildModel";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "entitlementCreate",
  execute: async (client: WouldYou, entitlement: Entitlement) => {
    if (!entitlement.guildId) return;
    const alreadyHasPremium = await client.premium.check(entitlement.guildId);

    const guild = await GuildModel.findOne({ guildID: entitlement.guildId });

    if (!guild) {
      await GuildModel.create({
        guildID: entitlement.guildId,
        language: "en_EN",
        botJoined: (Date.now() / 1000) | 0,
        premium: 1,
        premiumExpiration: entitlement?.endsTimestamp
          ? new Date(entitlement?.endsTimestamp)
          : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        premiumUser: entitlement.userId,
      });
      return;
    }

    // Check if the guild already has premium and which expiration date is higher
    if (
      alreadyHasPremium.result === true &&
      alreadyHasPremium.expiration &&
      entitlement.endsTimestamp &&
      entitlement.endsTimestamp < alreadyHasPremium?.expiration?.getTime()
    )
      return;

    await GuildModel.updateOne(
      { guildID: entitlement.guildId },
      {
        premium: 1,
        premiumExpiration: entitlement?.endsTimestamp
          ? new Date(entitlement?.endsTimestamp)
          : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        premiumUser: entitlement.userId,
      },
    );
  },
};

export default event;
