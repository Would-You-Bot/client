import { CoreLanguage } from './core';

export interface ReplayChannel {
  id: string;
  name: string;
  cooldown: number;
}

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

export interface GuildProfile {
  guildId: string;
  language: CoreLanguage;
  premium: {
    enabled: boolean;
    permanent?: boolean;
    expires?: number;
  };
  questionType: number;
  welcome: {
    enabled: boolean;
    channel?: string;
    ping?: boolean;
  };
  daily: {
    enabled: boolean;
    channel?: string;
    role?: string;
    timezone?: string;
    interval?: string;
    thread?: boolean;
  };
  replay: {
    enabled: boolean;
    cooldown: number;
    type: string;
    channels: ReplayChannel[];
  };
  botJoined: number;
  debug?: boolean;
}
