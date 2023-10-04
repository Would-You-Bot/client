import { gray, white, green } from "chalk-advanced";
import WouldYou from "../util/wouldYou";

export const handleShardReady = async (client: WouldYou, id: number) => {
  console.log(
    `${white("Would You?")} ${gray(">")} ${green("Shard is now ready #" + id)}`,
  );
};
