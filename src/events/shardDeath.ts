import { gray, green, white } from "chalk-advanced";
import WouldYou from "../util/wouldYou";
import { Event } from "../interfaces/event";

const event: Event = {
  event: "shardDeath",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(
        `Shard ${id} reconnecting...`,
      )}`,
    );
  },
};

export default event;
