import { captureException } from "@sentry/node";
import { gray, green, white } from "chalk-advanced";
import type { Event } from "../interfaces/event";
import { shardClusterStoreModel } from "../util/Models/ShardClusterStore";
import type WouldYou from "../util/wouldYou";

const event: Event = {
  event: "shardReady",
  execute: async (client: WouldYou, id: number) => {
    console.log(
      `${white("Would You?")} ${gray(">")} ${green(`Shard is now ready #${id}`)}`,
    );
    shardClusterStoreModel
      .findOneAndUpdate(
        { shard: id },
        { shard: id, cluster: client.cluster.id, pid: process.pid },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .catch((err: string) => captureException(err));

    const randomStatus =
      client.config.status[
        Math.floor(Math.random() * client.config.status.length)
      ];

    const setStatus = () => {
      if (!client.user) return;

      client.user.setPresence({
        activities: [
          {
            name: `${randomStatus || "Would You?"}`,
          },
        ],
        status: "dnd",
        shardId: id,
      });
    };

    setTimeout(() => setStatus(), 35 * 1000);
    setInterval(() => setStatus(), 60 * 60 * 1000);
  },
};

export default event;
