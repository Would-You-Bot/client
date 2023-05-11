const { env } = process;

const verifyEnvironment = (): NodeJS.ProcessEnv => {
  if (!env) throw new Error('env is not defined in .env file');

  const envKeys = [
    // Environment
    'NODE_ENV',
    'DEBUG',

    // Database
    'MONGODB_URI',

    // Discord bot
    'BOT_TOKEN_DEV',
    'BOT_TOKEN_BETA',
    'BOT_TOKEN_PROD',

    // Discord logging - channels must be in the log guild
    'LOG_GUILD',
    'ERROR_PING_ROLE',
    'WARN_WEBHOOK',
    'ERROR_WEBHOOK',
    'DEBUG_WEBHOOK',
    // 'WARN_CHANNEL',
    // 'ERROR_CHANNEL',
    // 'DEBUG_CHANNEL',

    // External Keys/Tokens
    'TOPGG_TOKEN',
    'VOTE_WEBHOOK,',
    // 'VOTE_CHANNEL',
  ];

  /**
   * Check if all keys are defined and are strings
   */
  envKeys.forEach((key) => {
    if (!env[key]) throw new Error(`env.${key} is not defined in .env file`);
    if (typeof env[key] !== 'string')
      throw new Error(`env.${key} is not a string`);
  });

  return env;
};

export default verifyEnvironment;
