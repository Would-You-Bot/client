import { readFileSync } from 'fs';
import { parse } from 'yaml';

import { ConfigType, EmojisConfig, MainConfig } from '@typings/config';
import { verifyEnvironment } from '@utils/index';

const emojisConfig = readFileSync('./config/emojis.yaml', 'utf8');
const limitsConfig = readFileSync('./config/limits.yaml', 'utf8');
const mainConfig = readFileSync('./config/main.yaml', 'utf8');
const main: MainConfig = parse(mainConfig);

const emojiList = parse(emojisConfig);
const emojisData: EmojisConfig = Object.keys(emojiList).reduce((acc, key) => {
  acc[key] = {
    full: emojiList[key],
    id: emojiList[key].split(':')[2].replace('>', ''),
  };
  return acc as EmojisConfig;
}, {} as EmojisConfig);

const env = verifyEnvironment();

const d = new Date();

export class Config implements ConfigType {
  // Main config values
  productionId = main.productionId;
  links = main.links;
  developers = main.developers;

  // Environment
  env = env;

  // Programatically generated config values
  logFolder = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;

  // Other config files
  limits = parse(limitsConfig);
  emojis = emojisData;

  constructor() {}

  // Additional config functions
  isDevelopment = (): boolean => env.NODE_ENV === 'development';
  isBeta = (): boolean => env.NODE_ENV === 'beta';
  isProduction = (): boolean => env.NODE_ENV === 'production';
}

const config = new Config();

export default config;
