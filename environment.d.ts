declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: 'development' | 'beta' | 'production';
      DEBUG: 'true' | 'false';

      // Database
      MONGODB_URI: string;

      // Discord bot
      BOT_TOKEN_DEV: string;
      BOT_TOKEN_BETA: string;
      BOT_TOKEN_PROD: string;

      // Discord logging - channels must be in the log guild
      LOG_GUILD: string;
      ERROR_PING_ROLE: string;
      WARN_WEBHOOK: string;
      ERROR_WEBHOOK: string;
      DEBUG_WEBHOOK: string;
      PRIVATE_WEBHOOK: string;
      PUBLIC_WEBHOOK: string;
      // WARN_CHANNEL: string;
      // ERROR_CHANNEL: string;
      // DEBUG_CHANNEL: string;

      // External Keys/Tokens
      TOPGG_TOKEN: string;
      VOTE_WEBHOOK: string;
      // VOTE_CHANNEL: string;
    }
  }
}

export {};
