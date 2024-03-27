import { Schema, model } from "mongoose";

export interface IQuestionModel {
  id: string;
  type: string;
  question: string;
  translations: {
    de: string;
    es: string;
    fr: string;
    it: string;
  };
}

const questionModelSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  translations: {
    de: { type: String, required: false },
    es: { type: String, required: false },
    fr: { type: String, required: false },
    it: { type: String, required: false },
  },
});

const createModel = (modelName: string, schema: Schema) => {
  return model<IQuestionModel>(modelName, schema);
}

export const wyrModel = createModel("wyrModel", questionModelSchema);
export const wwydModel = createModel("wwydModel", questionModelSchema);
export const nhieModel = createModel("nhieModel", questionModelSchema);
export const dareModel = createModel("dareModel", questionModelSchema);
export const truthModel = createModel("truthModel", questionModelSchema);
