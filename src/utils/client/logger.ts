import colors from 'colors';
import * as fs from 'fs';
import * as winston from 'winston';

import config from '@config';

const logsDir = `./tmp/logs/${config?.logFolder}`;

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
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
    if (stack) {
      message += `\n${stack}`; // Append the stack trace to the message if it is present
    }
    return `${colors.gray(timestamp)} (${colors.magenta(ms)}) [${levelColor(
      level
    )}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'debug',
  format: consoleFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      level: config?.env.debug ? 'debug' : 'info',
    }),
    // File transports
    new winston.transports.File({
      level: 'info',
      filename: `${logsDir}/info.log`,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: 'debug',
      filename: `${logsDir}/debug.log`,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: 'error',
      filename: `${logsDir}/error.log`,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: 'warn',
      filename: `${logsDir}/warn.log`,
      format: winston.format.json(),
    }),
    new winston.transports.File({
      level: 'trace',
      filename: `${logsDir}/trace.log`,
      format: winston.format.json(),
    }),
  ],
});

export default logger;
