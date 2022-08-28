const { Schema, model } = require('mongoose');

const guildProfile = new Schema(
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
    },
    wouldyou: {
      type: Boolean,
      default: false,
    },
    wouldyouChannel: {
    },
    botJoined: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = model('guildProfile', guildProfile);
