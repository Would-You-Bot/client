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

  let host = process.env.TCP_HOST || "dailyMessage";
  let port = parseInt(process.env.TCP_PORT ? process.env.TCP_PORT : "8989");
  socket.connect({ host: host, port: port }, () => {
    console.log("connected");
    socket.write(`${process.env.TCP_KEY}#CREATE#${cluster.id}`);
  });
  socket.on("data", (data) => {
    console.log(data);
    socket.destroy();
  });
});

manager.spawn({ timeout: -1 });
