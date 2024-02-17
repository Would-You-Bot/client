import "dotenv/config";
import { ClusterManager } from "discord-hybrid-sharding";
import net from "node:net";

const manager = new ClusterManager(`${__dirname}/index.js`, {
  shardsPerClusters: 3,
  totalShards: 12,
  mode: "process",
  token: process.env.TOKEN,
});

const socket = new net.Socket();


manager.on("clusterCreate", (cluster) => {
  cluster.on("ready", () => {
    console.log(`[Cluster Manager] Cluster ${cluster.id} ready`);

  });

  cluster.on("reconnecting", () => {
    console.log(`[Cluster Manager] Cluster ${cluster.id} reconnecting`);
  });
  console.log(`[Cluster Manager] Cluster ${cluster.id} created`);
  socket.connect({ host: "localhost", port: 8989 }, () => {
    console.log("connected")
    socket.write(`TSeb6kZ6FEj4jdJVCs8KUS3TJqjamMHoMBAV4iu2VgWFqqAVXt#CREATE#${cluster.id}`);
  });
  socket.on("data", (data) => {
    console.log(data);
    socket.destroy();
});
});

manager.spawn({ timeout: -1 });
