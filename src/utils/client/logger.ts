import colors from 'colors';
import * as fs from 'fs';
import { format } from 'logform';
import * as winston from 'winston';

import config from '@config';
import { getClusterId } from './getCluster';
import addDiscordLog from './logValues';

const logsDir = `./tmp/logs/${config.logFolder}`;
const clusterLogsDir = `./tmp/logs/${
  config.logFolder
}/cluster-${getClusterId()}`;

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create cluster logs directory if it doesn't exist
if (!fs.existsSync(clusterLogsDir)) {
  fs.mkdirSync(clusterLogsDir, { recursive: true });
}

const levelColor = (level: string) => {
  switch (level) {
    case 'error': {
      return colors.red(level.toUpperCase());
    }
    case 'warn': {
      return colors.yellow(level.toUpperCase());
    }
    case 'info': {
      return colors.green(level.toUpperCase());
    }
    case 'debug': {
      return colors.blue(level.toUpperCase());
    }
    case 'trace': {
      return colors.magenta(level.toUpperCase());
    }
    default: {
      return colors.white(level.toUpperCase());
    }
  }
};

const consoleFormat = winston.format.combine(
  // winston.format.prettyPrint(),
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.ms(),
  winston.format.errors({ stack: true }),
  // winston.format.splat(),
  // winston.format.json(),
  winston.format.printf(({ timestamp, ms, level, message, stack }) => {
    // Append the stack trace to the message if it is present
    if (stack) message += `\n${stack}`;

    const clusterId = getClusterId();

    addDiscordLog(
      level,
      `(${ms}) [Cluster ${clusterId}] [${level}]: ${message}`
    );

    /* eslint-disable no-control-regex */
    const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

    return `${colors.gray(timestamp)} (${colors.magenta(ms)}) [${colors.white(
      `Cluster ${clusterId}`
    )}] [${levelColor(level.replace(ANSI_REGEX, ''))}]: ${message}`;
  })
);

// Format for file transports that removes ANSI escape sequences
const fileFormat = winston.format.combine(
  format((info) => {
    /* eslint-disable no-control-regex */
    const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;
    info.level = info.level.replace(ANSI_REGEX, '');
    const clusterId = getClusterId();
    info.message = `[Cluster ${clusterId}] ${info.message.replace(
      ANSI_REGEX,
      ''
    )}`;
    return info;
  })(),
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: 'debug',
  format: consoleFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      level: config.debug ? 'debug' : 'info',
    }),
    // File transports
    new winston.transports.File({
      level: 'info',
      filename: `${clusterLogsDir}/info.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'debug',
      filename: `${clusterLogsDir}/debug.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'error',
      filename: `${clusterLogsDir}/error.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'warn',
      filename: `${clusterLogsDir}/warn.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'trace',
      filename: `${clusterLogsDir}/trace.log`,
      format: fileFormat,
    }),
  ],
});

export default logger;
