import { Schema, model } from "mongoose";
export interface IUsedQuestions {
  guildID: string;
  truthQuestions: string[];
  dareQuestions: string[];
  wwydQuestions: string[];
  wyrQuestions: string[];
  nhieQuestions: string[];
}

const usedQuestionSchema = new Schema({
    guildID: {
        type: String,
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

export const usedQuestionModel = model<IUsedQuestions>(
  "usedQuestions",
  usedQuestionSchema,
);
