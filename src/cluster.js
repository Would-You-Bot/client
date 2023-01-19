require('dotenv').config();
const Cluster = require("discord-hybrid-sharding");
const { ChalkAdvanced } = require('chalk-advanced');

const manager = new Cluster.Manager(`${__dirname}/index.js`, {
    totalClusters: 1,
    totalShards: 2,
    shardsPerClusters: 2,
    mode: "process",
    token: process.env.TOKEN,
}, true)

manager.extend(
    new Cluster.ReClusterManager(),
    new Cluster.HeartbeatManager({
        interval: 10000,
        maxMissedHeartbeats: 10,
    })
)

manager.on('clusterCreate', cluster => {
    console.log(
        `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
            '>',
        )} ${ChalkAdvanced.green('Successfully created cluster #' + cluster.id)}`,
    );
});
manager.spawn({timeout: -1})