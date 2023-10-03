import WouldYou from "../util/wouldYou";
import { white, gray, green } from "chalk-advanced";

export const handleShardResume = async (client: WouldYou, id: number) => {
  console.log(
    `${white("Would You?")} ${gray(
      ">",
    )} ${green(`Shard ${id} resumed`)}`,
  );
};
