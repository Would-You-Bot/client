import { ButtonInteraction, Interaction as dInteraction } from "discord.js";
import { IGuildModel } from "../util/Models/guildModel";
import WouldYou from "../util/wouldYou";

export interface Interaction {
  name: string;
  cooldown?: boolean;
  execute(
    interaction: dInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): Promise<void>;
}

export interface Button extends Interaction {
  execute(
    interaction: ButtonInteraction,
    client: WouldYou,
    guildDb: IGuildModel,
  ): Promise<void>;
}
