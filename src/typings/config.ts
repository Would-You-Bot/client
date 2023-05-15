type Emoji = { full: string; id: string };
export interface EmojisConfig {
  verified: Emoji;
  partner: Emoji;
  goodCheck: Emoji;
  badCheck: Emoji;
  logo: Emoji;
  arrowRight: Emoji;
  check: Emoji;
  mention: Emoji;
  replay: Emoji;
  close: Emoji;
  help: Emoji;
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
  status: string;
  links: {
    invite: string;
    website: string;
    support: string;
    vote: string;
    tos: string;
    privacy: string;
    logo: string;
  };
  developers: string[];
  colors: {
    primary: `#${string}`;
    success: `#${string}`;
    warning: `#${string}`;
    danger: `#${string}`;
    blurple: `#${string}`;
  };
  voteEmojis: string[];
}

export interface ConfigType extends MainConfig {
  logFolder: string;
  emojis: EmojisConfig;
  limits: LimitsConfig;

  // Environment
  env: NodeJS.ProcessEnv;
  envName: string;

  // Functions
  isDevelopment: () => boolean;
  isBeta: () => boolean;
  isProduction: () => boolean;
}
