import { gray, green, white } from "chalk-advanced";
import type { Event } from "../interfaces/event";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "shardResume",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(`Shard ${id} resumed`)}`,
    );
  },
};

export default event;
