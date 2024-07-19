import { Schema, model } from "mongoose";
export interface IUsedQuestions {
  guildID: string;
  truthQuestions: string[];
  customTruthQuestions: string[];
  dareQuestions: string[];
  customDareQuestions: string[];
  wwydQuestions: string[];
  customWwydQuestions: string[];
  wyrQuestions: string[];
  customWyrQuestions: string[];
  nhieQuestions: string[];
  customNhieQuestions: string[];
}

const usedQuestionSchema = new Schema({
  guildID: {
    type: String,
    require: true,
    unique: true,
  },
  customTruthQuestions: {
    type: Array,
    default: [],
  },
  truthQuestions: {
    type: Array,
    default: [],
  },
  customDareQuestions: {
    type: Array,
    default: [],
  },
  dareQuestions: {
    type: Array,
    default: [],
  },
  customNhieQuestions: {
    type: Array,
    default: [],
  },
  wwydQuestions: {
    type: Array,
    default: [],
  },
  customWwydQuestions: {
    type: Array,
    default: [],
  },
  wyrQuestions: {
    type: Array,
    default: [],
  },
  customWyrQuestions: {
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
