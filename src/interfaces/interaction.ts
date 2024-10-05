import type {
  ButtonInteraction,
  Interaction as dInteraction,
} from "discord.js";
import type { IGuildModel } from "../util/Models/guildModel";
import type WouldYou from "../util/wouldYou";

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
