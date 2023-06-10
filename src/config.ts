import { readFileSync } from 'fs';
import { parse } from 'yaml';

import {
  ConfigType,
  EmojisConfig,
  LimitsConfig,
  MainConfig,
} from '@typings/config';
import verifyEnvironment from '@utils/start/verifyEnvironment';

// Load the config files
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

const env = verifyEnvironment;
const date = new Date();

/**
 * The config class.
 */
export class Config implements ConfigType {
  // Main config values
  public productionId = main.productionId;
  public links = main.links;
  public developers = main.developers;
  public colors = main.colors;
  public status = main.status;

  // Environment
  public env = env;
  public debug = env.NODE_ENV === 'production' ? false : env.DEBUG;
  public envName: string;
  public BOT_TOKEN: string;

  // Programatically generated config values
  public logFolder: string;

  // Other config files
  public limits = parse(limitsConfig) as LimitsConfig;
  public emojis = emojisData;
  public voteEmojis = main.voteEmojis;

  /**
   * The config class.
   */
  public constructor() {
    if (this.isProduction()) {
      this.envName = 'Would You Production';
      this.BOT_TOKEN = env.BOT_TOKEN_PROD;
    } else if (this.isBeta()) {
      this.envName = 'Would You Beta';
      this.BOT_TOKEN = env.BOT_TOKEN_BETA;
    } else {
      this.envName = 'Would You Dev';
      this.BOT_TOKEN = env.BOT_TOKEN_DEV;
    }

    this.logFolder = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  }

  /**
   * Check if the bot is in development mode.
   * @returns Whether the bot is in development mode.
   */
  public isDevelopment = (): boolean => this.env.NODE_ENV === 'development';

  /**
   * Check if the bot is in beta mode.
   * @returns Whether the bot is in beta mode.
   */
  public isBeta = (): boolean => this.env.NODE_ENV === 'beta';

  /**
   * Check if the bot is in production mode.
   * @returns Whether the bot is in production mode.
   */
  public isProduction = (): boolean => this.env.NODE_ENV === 'production';
}

const config = new Config();

/**
 * The config instance (initialized config class).
 */
export default config;
