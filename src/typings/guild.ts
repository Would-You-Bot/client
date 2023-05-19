import { CoreLanguage } from './core';

export interface CustomMessage {
  id: string;
  type: string;
  msg: string;
}

export enum GuildQuestionType {
  Default = 0,
  Custom = 1,
  Mixed = 2,
}

export const AllGuildQuestionTypes = [GuildQuestionType.Default, GuildQuestionType.Custom, GuildQuestionType.Mixed];

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

export interface ReplayChannel {
  id: string;
  name: string;
  cooldown: number;
}

export interface GuildProfile {
  guildId: string;
  timezone: string;
  language: CoreLanguage;
  premium: GuildPremium;
  welcome: GuildWelcome;
  daily: GuildDaily;
  botJoined: number;
  debug?: boolean;
}
