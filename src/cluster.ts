import "dotenv/config";
import {
  ClusterManager,
  ReClusterManager,
  HeartbeatManager,
} from "discord-hybrid-sharding";

const manager = new ClusterManager(`${__dirname}/index.js`, {
  shardsPerClusters: 10,
  totalShards: 9,
  mode: "process",
  token: process.env.TOKEN,
});

manager.extend(
  new ReClusterManager({
    delay: 2000,
    timeout: -1,
    restartMode: "gracefulSwitch",
  }),
  new HeartbeatManager({
    interval: 10000,
    maxMissedHeartbeats: 10,
  }),
);

manager.on("clusterCreate", (cluster) => {
  cluster.on("ready", () => {
    console.log(`[Cluster Manager] Cluster ${cluster.id} ready`);
  });

  cluster.on("reconnecting", () => {
    console.log(`[Cluster Manager] Cluster ${cluster.id} reconnecting`);
  });

  console.log(`[Cluster Manager] Cluster ${cluster.id} created`);
});

manager.spawn({ timeout: -1 });
