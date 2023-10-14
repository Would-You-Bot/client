const { Schema, model } = require("mongoose");

const userModel = new Schema(
  {
    userID: { type: String, required: true, unique: true },
    votePrivacy: { type: Boolean, default: false },
    
    wouldyourather: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    neverhaveiever: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    higherlower: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      highscore: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
    whatwouldyoudo: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      used: {
        command: { type: Number, default: 0 },
        replay: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
);

module.exports = model("userModel", userModel);
