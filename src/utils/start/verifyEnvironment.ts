import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

/**
 * Verify the environment variables are all provided and of type 'string'.
 * @returns The verified environment variables.
 */
const verifyEnvironment = (): NodeJS.ProcessEnv => {
  const envKeys = [
    'NODE_ENV',
    'DEBUG',

    'MONGODB_URI',

    'BOT_TOKEN_DEV',
    'BOT_TOKEN_BETA',
    'BOT_TOKEN_PROD',

    'TOPGG_TOKEN',

    'DEV_GUILD',
    'DEV_ROLE',
    'PREMIUM_CHANNEL',
    'GUILD_CHANNEL',
    'ALERTS_CHANNEL',
    'INFO_CHANNEL',
    'WARN_CHANNEL',
    'ERROR_CHANNEL',
    'DEBUG_CHANNEL',
    'VOTE_CHANNEL',
  ];

  /**
   * Check if all keys are defined and are strings.
   */
  envKeys.forEach((key) => {
    if (!env[key]) throw new Error(`env.${key} is not defined in .env file`);
    if (typeof env[key] !== 'string') throw new Error(`env.${key} is not a string`);
  });

  return env;
};

export default verifyEnvironment;
