import { Schema, model } from "mongoose";

export interface IVoteModel {
  id: string;
  guild: string;
  channel: string;
  type: string;
  votes: any;
  until: any;
}
const voteModelSchema = new Schema(
  {
    id: { type: String, required: true },
    guild: { type: String, required: false },
    channel: { type: String, required: true },
    type: { type: String }, // 0 = wouldyourather, 1 = neverhaveiever
    votes: {
      op_one: { type: Array, default: [] },
      op_two: { type: Array, default: [] },
    },

    until: { type: Date, required: false },
  },
  { timestamps: true },
);

export const VoteModel = model<IVoteModel>("voteModel", voteModelSchema);
