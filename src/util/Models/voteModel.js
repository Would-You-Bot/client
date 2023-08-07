const { Schema, model } = require("mongoose");

const voteModel = new Schema(
  {
    id: { type: String, required: true },
    guild: { type: String, required: false },
    channel: { type: String, required: true },
    type: { type: Number, default: 0 }, // 0 = wouldyourather, 1 = neverhaveiever
    votes: {
      op_one: { type: Array, default: [] },
      op_two: { type: Array, default: [] },
    },

    until: { type: Date, required: false },
  },
  { timestamps: true },
);

module.exports = model("voteModel", voteModel);
