declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DEBUG: string;

      MONGODB_URI_DEV: string;
      MONGODB_URI_PROD: string;
      SECRET_KEY: string;
      SECRET_IV: string;
      ENCRYPTION_METHOD: string;

      BOT_TOKEN_DEV: string;
      BOT_TOKEN_BETA: string;
      BOT_TOKEN_PROD: string;

      TOPGG_TOKEN: string;

      DEV_GUILD: string;
      DEV_ROLE: string;

      PUBLIC_VOTE_CHANNEL: string;
      PUBLIC_GUILD_CHANNEL: string;

      PREMIUM_CHANNEL: string;
      GUILD_CHANNEL: string;
      ALERTS_CHANNEL: string;
      INFO_CHANNEL: string;
      WARN_CHANNEL: string;
      ERROR_CHANNEL: string;
      DEBUG_CHANNEL: string;
    }
  }
}

export {};
