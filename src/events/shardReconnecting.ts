import { gray, green, white } from "chalk-advanced";
import WouldYou from "../util/wouldYou";

export const handleShardReconnecting = async (client: WouldYou, id: number) => {
  console.log(
    `${white("Would You?")} ${gray(
      ">",
    )} ${green(`Shard ${id} reconnecting...`)}`,
  );
};
