declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: 'development' | 'beta' | 'production';
      DEBUG: string;

      // Discord bot
      BOT_TOKEN: string;
      BOT_TOKEN_BETA: string;
      BOT_TOKEN_PROD: string;

      // Discord logging
      LOG_GUILD: string;
      WARN_CHANNEL: string;
      ERROR_CHANNEL: string;
      DEBUG_CHANNEL: string;
      VOTE_CHANNEL: string;

      // External Keys/Tokens
      TOPGG_TOKEN: string;
    }
  }
}

export {};
