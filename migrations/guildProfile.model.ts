import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

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

export interface GuildProfileSchema extends SchemaTimestampsConfig {
  guildID: string;
  language: string;
  welcome?: boolean;
  welcomeChannel?: string;
  welcomePing?: boolean;
  dailyMsg?: boolean;
  dailyChannel?: string;
  dailyRole?: string;
  dailyTimezone?: string;
  dailyInterval?: string;
  dailyThread?: boolean;
  replay?: boolean;
  replayCooldown?: number;
  replayType?: string;
  replayChannels?: ReplayChannel[];
  botJoined?: number;
  customMessages?: CustomMessage[];
  customTypes?: string;
  debugMode?: boolean;
}

export type GuildProfileDocument = GuildProfileSchema & Document;

export default model<GuildProfileDocument>(
  'GuildProfile',
  new Schema<GuildProfileSchema>(
    {
      guildID: {
        type: String,
        required: true,
        unique: true,
      },
      language: {
        type: String,
        default: 'en_EN',
        required: true,
      },
      welcome: {
        type: Boolean,
        default: false,
      },
      welcomeChannel: {
        type: String,
        default: null,
      },
      welcomePing: {
        type: Boolean,
        default: false,
      },
      dailyMsg: {
        type: Boolean,
        default: false,
      },
      dailyChannel: {
        type: String,
        default: null,
      },
      dailyRole: {
        type: String,
        default: null,
      },
      dailyTimezone: {
        type: String,
        default: 'America/Chicago',
      },
      dailyInterval: {
        type: String,
        default: '12:00',
      },
      dailyThread: {
        type: Boolean,
        default: false,
      },
      replay: {
        type: Boolean,
        default: true,
      },
      replayCooldown: {
        type: Number,
        default: 30000,
      },
      replayType: {
        type: String,
        default: 'Guild',
      },
      replayChannels: [
        {
          type: Object,
          default: {},
        },
      ],
      botJoined: {
        type: Number,
      },
      customMessages: [
        {
          type: Object,
          default: {},
        },
      ],
      customTypes: {
        type: String,
        default: 'mixed',
      },
      debugMode: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);
