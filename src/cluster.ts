import { ClusterManager } from "discord-hybrid-sharding";
import "dotenv/config";

const manager = new ClusterManager(`${__dirname}/index.js`, {
  shardsPerClusters: 10,
  totalShards: "auto",
  mode: "process",
  token: process.env.TOKEN,
  execArgv: ["--max-old-space-size=6000"],
});

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
