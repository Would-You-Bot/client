type Emoji = { full: string; id: string };
export interface EmojisConfig {
  example_emoji: Emoji;
  [key: string]: Emoji;
}

interface LimitValues {
  Free?: number;
  Premium?: number;
}

type Limits = Readonly<LimitValues> & number[];

export interface LimitsConfig {
  cooldown: {
    slash: Limits;
    context: Limits;
    button: Limits;
    selectMenu: Limits;
    modal: Limits;
  };
}

export interface MainConfig {
  productionId: string;
  links: {
    invite: string;
    website: string;
    support: string;
    vote: string;
    tos: string;
    privacy: string;
  };
  developers: string[];
}

export interface ConfigType extends MainConfig {
  logFolder?: string | boolean;
  emojis: EmojisConfig;
  limits: LimitsConfig;

  // Environment
  env: NodeJS.ProcessEnv;

  // Functions
  isDevelopment: () => boolean;
  isBeta: () => boolean;
  isProduction: () => boolean;
}
