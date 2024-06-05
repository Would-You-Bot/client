import { gray, green, white } from "chalk-advanced";
import { Event } from "../interfaces/event";
import WouldYou from "../util/wouldYou";

const event: Event = {
  event: "shardReconnecting",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(
        `Shard ${id} reconnecting...`,
      )}`,
    );
  },
};

export default event;
