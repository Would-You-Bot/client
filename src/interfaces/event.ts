import type { IGuildModel } from "../util/Models/guildModel";
import type WouldYou from "../util/wouldYou";

export interface Event {
  event: string;
  execute(client: WouldYou, payload: any, payload2?: any): Promise<void>;
  autocomplete?(client: WouldYou, payload: any, guildDb?: IGuildModel,): Promise<void>;
}
