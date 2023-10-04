import "dotenv/config";
import {
  ClusterManager,
  ReClusterManager,
  HeartbeatManager,
} from "discord-hybrid-sharding";
import { white, gray, green } from "chalk-advanced";

const manager = new ClusterManager(`${__dirname}/index.js`, {
  totalShards: "auto",
  shardsPerClusters: 10,
  mode: "process",
  token: process.env.TOKEN,
});

manager.extend(
  new ReClusterManager(),
  new HeartbeatManager({
    interval: 10000,
    maxMissedHeartbeats: 10,
  }),
);

manager.on("clusterCreate", (cluster) => {
  console.log(
    `${white("Would You?")} ${gray(">")} ${green(
      "Successfully created cluster #" + cluster.id,
    )}`,
  );
});

manager.spawn({ timeout: -1 });
