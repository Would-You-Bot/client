import { Schema, model } from "mongoose";

export interface IGuildModel {
  guildID: string;
  language: string;
  welcome: boolean;
  welcomeChannel: string;
  welcomePing: boolean;
  welcomeType: string;
  dailyMsg: boolean;
  dailyChannel: string;
  dailyRole: string;
  dailyTimezone: string;
  dailyInterval: string;
  dailyThread: boolean;
  replay: boolean;
  replayCooldown: number;
  replayType: string;
  replayChannels: Array<{
    id: string;
    cooldown: string;
    name: string;
  }>;
  botJoined: number;
  customMessages: Array<{
    id: string;
    msg: string;
    type: string;
  }>;
  customTypes: string;
  debugMode: boolean;
}

const guildProfileSchema = new Schema(
  {
    guildID: {
      type: String,
      required: true,
      unique: true,
    },
    language: {
      type: String,
      default: "en_EN",
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
    welcomeType: {
      type: String,
      default: "mixed",
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
      default: "America/Chicago",
    },
    dailyInterval: {
      type: String,
      default: "12:00",
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
      default: "Guild",
    },
    replayChannels: [
      {
        id: { type: String, required: true },
        cooldown: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    botJoined: {
      type: Number,
    },
    customMessages: [
      {
        id: { type: String, required: true },
        msg: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    customTypes: {
      type: String,
      default: "mixed",
    },
    debugMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const GuildModel = model<IGuildModel>(
  "guildProfile",
  guildProfileSchema,
);
