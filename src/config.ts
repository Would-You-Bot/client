import { readFileSync } from 'fs';
import { parse } from 'yaml';

import {
  ConfigType,
  EmojisConfig,
  LimitsConfig,
  MainConfig,
} from '@typings/config';
import verifyEnvironment from '@utils/start/verifyEnvironment';

const emojisConfig: string = readFileSync('./config/emojis.yaml', 'utf8');
const limitsConfig: string = readFileSync('./config/limits.yaml', 'utf8');
const mainConfig: string = readFileSync('./config/main.yaml', 'utf8');
const main: MainConfig = parse(mainConfig) as MainConfig;

const emojiList = parse(emojisConfig) as Record<string, string>;
const emojisData = {} as EmojisConfig;

// Loop through each of the emoji strings and format them into an object with the full string and the id
Object.keys(emojiList).reduce((acc, key: string) => {
  emojisData[key] = {
    full: emojiList[key],
    id: emojiList[key].split(':')[2]?.replace('>', ''),
  };
  return acc;
});

const env = verifyEnvironment();
const d = new Date();

/**
 * The config class.
 */
export class Config implements ConfigType {
  // Main config values
  productionId = main.productionId;
  links = main.links;
  developers = main.developers;
  colors = main.colors;
  status = main.status;

  // Environment
  env = env;
  debug = env.NODE_ENV === 'production' ? false : env.DEBUG;
  envName: string;
  BOT_TOKEN: string;

  // Programatically generated config values
  logFolder: string;

  // Other config files
  limits = parse(limitsConfig) as LimitsConfig;
  emojis = emojisData;
  voteEmojis = main.voteEmojis;

  /**
   * The config class.
   */
  constructor() {
    if (this.isProduction()) {
      this.envName = 'Main Bot';
      this.BOT_TOKEN = env.BOT_TOKEN_PROD;
    } else if (this.isBeta()) {
      this.envName = 'Beta Bot';
      this.BOT_TOKEN = env.BOT_TOKEN_BETA;
    } else {
      this.envName = 'Dev Bot';
      this.BOT_TOKEN = env.BOT_TOKEN_DEV;
    }

    this.logFolder = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
  }

  /**
   * Check if the bot is in development mode.
   * @returns Whether the bot is in development mode.
   */
  isDevelopment = (): boolean => this.env.NODE_ENV === 'development';

  /**
   * Check if the bot is in beta mode.
   * @returns Whether the bot is in beta mode.
   */
  isBeta = (): boolean => this.env.NODE_ENV === 'beta';

  /**
   * Check if the bot is in production mode.
   * @returns Whether the bot is in production mode.
   */
  isProduction = (): boolean => this.env.NODE_ENV === 'production';
}

const config = new Config();

/**
 * The config instance (initialized config class).
 */
export default config;
