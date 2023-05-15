import colors from 'colors';
import {
  ClusterManager,
  HeartbeatManager,
  ReClusterManager,
} from 'discord-hybrid-sharding';
import dotenv from 'dotenv';

dotenv.config();

import config from '@config';
import logger from './utils/client/loggerOffline';

if (config.debug) logger.info('Running application in debug mode.');

const manager = new ClusterManager(`${__dirname}/app.js`, {
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
  logger.info(colors.green(`Successfully created cluster #${cluster.id}`));
});

manager.on('clusterReady', (cluster) => {
  logger.info(colors.green(`Successfully initialized cluster #${cluster.id}`));
});

manager.on('debug', (message) => {
  logger.debug(message);
});

manager.spawn({ timeout: -1 });
