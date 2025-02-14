import { Schema, model } from "mongoose";

export interface IGuildModel {
  guildID: string;
  gameScores: Array<{
    userID: string;
    higherlower: number;
  }>;
  language: string;
  welcome: boolean;
  welcomeChannel: string;
  welcomePing: boolean;
  welcomeType: string;
  welcomeMessage: string;
  welcomeEmbed: boolean;
  welcomeEmbedTitle: string | null;
  welcomeEmbedTitleURL: string | null;
  welcomeEmbedDescription: string | null;
  welcomeEmbedAuthorName: string | null;
  welcomeEmbedAuthorURL: string | null;
  welcomeEmbedThumbnail: string | null;
  welcomeEmbedImage: string | null;
  welcomeEmbedFooterText: string | null;
  welcomeEmbedFooterURL: string | null;
  welcomeEmbedColor: string | null;
  welcomeEmbedTimestamp: boolean;
  welcomeEmbedContent: string | null;
  dailyMsg: boolean;
  dailyChannel: string;
  dailyRole: string | null;
  dailyTimezone: string;
  dailyInterval: string;
  dailyThread: boolean;
  excludedDays: number[];
  replay: boolean;
  replayCooldown: number;
  replayBy: string;
  replayType: string;
  replayChannels: Array<{
    id: string;
    cooldown: string;
    name: string;
  }>;
  botJoined: number;
  customMessages: Array<{
    id: string;
    question: string;
    type: string;
  }>;
  customTypes: string;
  channelTypes: Array<{
    channelId: string;
    questionType: "regular" | "custom" | "mixed";
  }>;
  debugMode: boolean;
  classicMode: boolean;
  autoPin: boolean;
  premium: number;
  pending: boolean;
  premiumExpiration: Date | null;
  premiumUser: string | null;
  webhookName: string;
  webhookAvatar: string;
  lastUsageTimestamp: number;
  commandCooldown: number;
  commandBy: string;
  commandType: string;
}

const guildProfileSchema = new Schema<IGuildModel>(
  {
    guildID: {
      type: String,
      required: true,
      unique: true,
    },
    gameScores: [
      {
        userID: { type: String, required: true },
        higherlower: { type: Number, required: false },
      },
    ],
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
    welcomeMessage: {
      type: String,
      default: null,
    },
    welcomeEmbed: {
      type: Boolean,
      default: false,
    },
    welcomeEmbedTitle: {
      type: String,
      default: null,
    },
    welcomeEmbedTitleURL: {
      type: String,
      default: null,
    },
    welcomeEmbedDescription: {
      type: String,
      default: null,
    },
    welcomeEmbedAuthorName: {
      type: String,
      default: null,
    },
    welcomeEmbedAuthorURL: {
      type: String,
      default: null,
    },
    welcomeEmbedThumbnail: {
      type: String,
      default: null,
    },
    welcomeEmbedImage: {
      type: String,
      default: null,
    },
    welcomeEmbedFooterText: {
      type: String,
      default: null,
    },
    welcomeEmbedFooterURL: {
      type: String,
      default: null,
    },
    welcomeEmbedColor: {
      type: String,
      default: null,
    },
    welcomeEmbedTimestamp: {
      type: Boolean,
      default: null,
    },
    welcomeEmbedContent: {
      type: String,
      default: null,
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
    excludedDays: {
      type: [Number],
      default: [],
    },
    replay: {
      type: Boolean,
      default: true,
    },
    replayCooldown: {
      type: Number,
      default: 30000,
    },
    replayBy: {
      type: String,
      default: "Guild",
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
        question: { type: String, required: true },
        type: { type: String, required: true },
      },
    ],
    customTypes: {
      type: String,
      default: "mixed",
    },
    channelTypes: [
      {
        channelId: { type: String, required: true },
        questionType: {
          type: String,
          enum: ["regular", "custom", "mixed"],
          default: "regular",
        },
      },
    ],
    debugMode: {
      type: Boolean,
      default: false,
    },
    classicMode: {
      type: Boolean,
      default: false,
    },
    autoPin: {
      type: Boolean,
      default: false,
    },
    premium: {
      type: Number,
      default: 0,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    premiumExpiration: {
      type: Date,
    },
    premiumUser: {
      type: String,
    },
    webhookName: {
      type: String,
    },
    webhookAvatar: {
      type: String,
    },
    lastUsageTimestamp: {
      type: Number,
      default: 0,
    },
    commandCooldown: {
      type: Number,
      default: 3000,
    },
    commandBy: {
      type: String,
      default: "Guild",
    },
    commandType: {
      type: String,
      default: "Command",
    },
  },
  { timestamps: true },
);

export const GuildModel = model<IGuildModel>(
  "guildProfile",
  guildProfileSchema,
);
