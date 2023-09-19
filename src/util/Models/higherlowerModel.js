const { Schema, model } = require("mongoose");
const higherlowerModel = new Schema(
  {
    creator: { type: String, required: true },
    created: { type: Date, required: true },
    id: { type: String, required: true },
    guild: { type: String, required: true },
    items: {
      current: { type: Object, required: true },
      history: { type: Array, required: true },
    },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);
module.exports = model("higherlowerModel", higherlowerModel);