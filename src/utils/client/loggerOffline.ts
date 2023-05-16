import colors from 'colors';
import * as fs from 'fs';
import { format } from 'logform';
import * as winston from 'winston';

import config from '@config';
import addDiscordLog from './logValues';

const logsDir = `./tmp/logs/${config.logFolder}`;

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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

    addDiscordLog(level, `(${ms}) [${level}]: ${message}`);

    return `${colors.gray(timestamp)} (${colors.magenta(
      ms
    )}) [${level}]: ${message}`;
  })
);

// Format for file transports that removes ANSI escape sequences
const fileFormat = winston.format.combine(
  format((info) => {
    /* eslint-disable no-control-regex */
    const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;
    info.message = info.message.replace(ANSI_REGEX, '');
    return info;
  })(),
  winston.format.timestamp(),
  winston.format.json()
);

const loggerOffline = winston.createLogger({
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
      filename: `${logsDir}/info.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'debug',
      filename: `${logsDir}/debug.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'error',
      filename: `${logsDir}/error.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'warn',
      filename: `${logsDir}/warn.log`,
      format: fileFormat,
    }),
    new winston.transports.File({
      level: 'trace',
      filename: `${logsDir}/trace.log`,
      format: fileFormat,
    }),
  ],
});

export default loggerOffline;
