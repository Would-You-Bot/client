import { Schema, model } from "mongoose";

export interface IHigherLowerModel {
  creator: string;
  created: Date;
  id: string;
  guild: string;
  items: any;
  score: number;
}

const higherlowerModelSchema = new Schema(
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
  { timestamps: true },
);

export const HigherlowerModel = model<IHigherLowerModel>(
  "higherlowerModel",
  higherlowerModelSchema,
);
