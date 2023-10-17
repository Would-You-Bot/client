import { Event } from "../models/event";
import WouldYou from "../util/wouldYou";
import { white, gray, green } from "chalk-advanced";

const event: Event = {
  event: "shardResume",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(`Shard ${id} resumed`)}`
    );
  },
};

export default event;
