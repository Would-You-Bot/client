import { gray, green, white } from "chalk-advanced";
import WouldYou from "../util/wouldYou";
import { Event } from "../interfaces/event";
import { shardClusterStoreModel } from "../util/Models/ShardClusterStore";
import { captureException } from "@sentry/node";

const event: Event = {
  event: "shardDeath",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(`Shard ${id} is death.`)}`,
    );

    shardClusterStoreModel
      .findOneAndDelete({ shard: id, cluster: client.cluster.id })
      .catch((err: string) => captureException(err));
  },
};

export default event;
