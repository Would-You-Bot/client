import { Schema, model } from "mongoose";
export interface IShardClusterStore {
  guildID: number;
}

const usedQuestionSchema = new Schema({
    guildID: {
        type: Number,
        require: true,
        unique: true,
    },
    truthQuestions: {
        type: Array,
        default: [],
    },
    dareQuestions: {
        type: Array,
        default: [],
    },
    wwydQuestions: {
        type: Array,
        default: [],
    },
    wyrQuestions: {
        type: Array,
        default: [],
    },
    nhieQuestions: {
        type: Array,
        default: [],
    },
});

export const shardClusterStoreModel = model<IShardClusterStore>(
  "usedQuestions",
  usedQuestionSchema,
);
