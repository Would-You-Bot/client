import { readFileSync } from 'fs';
import { parse } from 'yaml';

import { ConfigType, EmojisConfig, MainConfig } from '@typings/config';
import { verifyEnvironment } from '@utils/start';

const emojisConfig = readFileSync('./config/emojis.yaml', 'utf8');
const limitsConfig = readFileSync('./config/limits.yaml', 'utf8');
const mainConfig = readFileSync('./config/main.yaml', 'utf8');
const main: MainConfig = parse(mainConfig);

const emojiList = parse(emojisConfig);
const emojisData: EmojisConfig = Object.keys(emojiList).reduce((acc, key) => {
  acc[key] = {
    full: emojiList[key],
    id: emojiList[key].split(':')[2]?.replace('>', ''),
  };
  return acc as EmojisConfig;
}, {} as EmojisConfig);

const env = verifyEnvironment();

const d = new Date();

/**
 * The config class
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
  limits = parse(limitsConfig);
  emojis = emojisData;
  voteEmojis = main.voteEmojis;

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

  // Additional config functions
  isDevelopment = (): boolean => this.env.NODE_ENV === 'development';
  isBeta = (): boolean => this.env.NODE_ENV === 'beta';
  isProduction = (): boolean => this.env.NODE_ENV === 'production';
}

const config = new Config();

/**
 * The config instance (initialized config class)
 */
export default config;
