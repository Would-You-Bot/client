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

if (config.debug) loggerOffline.info('Running application in debug mode.');

const manager = new ClusterManager(`${__dirname}/index.js`, {
  totalClusters: 1,
  totalShards: 1,
  shardsPerClusters: 2,
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

manager.on('clusterCreate', (cluster) => {
  loggerOffline.info(
    colors.green(`Successfully created cluster #${cluster.id}`)
  );
});

manager.on('clusterReady', (cluster) => {
  loggerOffline.info(
    colors.green(`Successfully initialized cluster #${cluster.id}`)
  );
});

manager.on('debug', (message) => {
  loggerOffline.debug(message);
});

manager.spawn({ timeout: -1 });
