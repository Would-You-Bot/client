const { Schema, model } = require("mongoose");

const guildProfile = new Schema(
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
      default: "mixed",
    },
    debugMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = model("guildProfile", guildProfile);
