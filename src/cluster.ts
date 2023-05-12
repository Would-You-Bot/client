import colors from 'colors';
import {
  ClusterManager,
  HeartbeatManager,
  ReClusterManager,
} from 'discord-hybrid-sharding';
import dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils';

const manager = new ClusterManager(`${__dirname}/index.ts`, {
  totalClusters: 1,
  totalShards: 1,
  shardsPerClusters: 2,
  mode: 'process',
  token: process.env.TOKEN,
});

manager.extend(
  new ReClusterManager(),
  new HeartbeatManager({
    interval: 10000,
    maxMissedHeartbeats: 10,
  })
);

manager.on('clusterCreate', (cluster) => {
  logger.info(
    `${colors.white('Would You?')} ${colors.gray('>')} ${colors.green(
      'Successfully created cluster #' + cluster.id
    )}`
  );
});

manager.spawn({ timeout: -1 });
