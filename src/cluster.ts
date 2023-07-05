import colors from 'colors';
import {
  ClusterManager,
  HeartbeatManager,
  ReClusterManager,
} from 'discord-hybrid-sharding';
import dotenv from 'dotenv';

dotenv.config();

import config from '@config';
import loggerOffline from './utils/client/loggerOffline';

// If debug mode is enabled, log it
if (config.debug) loggerOffline.info('Running application in debug mode.');

// Initialize the cluster manager
const manager = new ClusterManager(`${__dirname}/index.js`, {
  totalClusters: 1,
  totalShards: 1,
  shardsPerClusters: 10,
  mode: 'process',
  token: process.env.BOT_TOKEN_DEV,
});

manager.extend(
  new ReClusterManager(),
  new HeartbeatManager({
    interval: 10000,
    maxMissedHeartbeats: 10,
  })
);

// Log when a cluster is created
manager.on('clusterCreate', (cluster) => {
  loggerOffline.info(
    colors.green(`Successfully created cluster #${cluster.id}`)
  );
});

// Log when a cluster is ready
manager.on('clusterReady', (cluster) => {
  loggerOffline.info(
    colors.green(`Successfully initialized cluster #${cluster.id}`)
  );
});

// Debug cluster events
// manager.on('debug', (message) => {
//   loggerOffline.debug(message);
// });

// Spawn the clusters
manager.spawn({ timeout: -1 });
