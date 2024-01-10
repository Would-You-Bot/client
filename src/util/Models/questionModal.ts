import { Schema, model } from "mongoose";
export interface IQuestionModel {
  locale: string;
  type: string;
  questions: string[];
}
const questionModelSchema = new Schema({
  locale: {
    type: String,
    required: true,
    default: "en_EN",
  },
  type: {
    type: String,
    index: true,
    required: true,
  },
  questions: {
    type: Array,
    required: true,
    default: [],
  },
});
export const QuestionModel = model<IQuestionModel>(
  "question",
  questionModelSchema,
);