import { gray, green, white } from "chalk-advanced";
import type { Event } from "../interfaces/event";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "shardReconnecting",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(`Shard ${id} reconnecting...`)}`,
    );
  },
};

export default event;
