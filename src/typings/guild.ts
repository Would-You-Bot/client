export interface CustomMessage {
  id: string;
  type: string;
  msg: string;
}

export enum GuildPackType {
  Base = 0,
  Custom = 1,
  Mixed = 2,
}

export const AllGuildQuestionTypes = [
  GuildPackType.Base,
  GuildPackType.Custom,
  GuildPackType.Mixed,
];

export interface GuildPremium {
  enabled: boolean;
  permanent?: boolean;
  expires?: number;
}

export interface GuildWelcome {
  enabled: boolean;
  channel?: string;
  ping?: boolean;
}

export interface GuildDaily {
  enabled: boolean;
  channel?: string;
  role?: string;
  time: string;
  thread: boolean;
}

export enum GuildLanguage {
  English = 'en',
  German = 'de',
  Spanish = 'es',
}

export interface GuildProfile {
  guildId: string;
  timezone: string;
  packType: GuildPackType;
  language: GuildLanguage;
  premium: GuildPremium;
  welcome: GuildWelcome;
  daily: GuildDaily;
  botJoined: number;
  botLeft?: number;
}
