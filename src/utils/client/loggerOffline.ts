import colors from 'colors';
import * as fs from 'fs';
import { TransformableInfo, format } from 'logform';
import * as winston from 'winston';

import config from '@config';

const logsDir = `./tmp/logs/${config.logFolder}`;

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Returns a color based on the log level.
 * @param level The log level.
 * @returns The colored log level.
 */
const levelColor = (level: string): string => {
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

/**
 * The format for the console transport.
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.ms(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ ms, level, message, stack }: TransformableInfo) => {
    let msg = message as string;

    // Append the stack trace to the message if it is present
    if (stack) msg += `\n${stack as string}`;

    /* eslint-disable no-control-regex */
    const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;

    return `[${colors.gray('would-you')}] ${colors.cyan(
      ms as string
    )} [${levelColor(level.replace(ANSI_REGEX, ''))}]: ${msg}`;
  })
);

/**
 * Format for file transports that removes ANSI escape sequences.
 */
const fileFormat = winston.format.combine(
  format((info: { level: string; message: string }) => {
    const newInfo = info;
    /* eslint-disable no-control-regex */
    const ANSI_REGEX = /\u001b\[[0-9]{1,2}m/gi;
    newInfo.level = info.level.replace(ANSI_REGEX, '');
    newInfo.message = info.message.replace(ANSI_REGEX, '');
    return newInfo;
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
