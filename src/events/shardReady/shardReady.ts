import { gray, white, green } from "chalk-advanced";
import WouldYou from "../../util/wouldYou";
import { Event } from "../../models/event";

const event: Event = {
  event: "shardReady",
  execute: async (client: WouldYou, id: number) => {
  console.log(
    `${white("Would You?")} ${gray(">")} ${green("Shard is now ready #" + id)}`,
  );
  }
};

export default event;