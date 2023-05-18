import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

import { BasePack } from '@typings/questions';

export interface BasePackSchema extends BasePack, SchemaTimestampsConfig {}

export type BasePackDocument = HydratedDocument<BasePackSchema>;

export const BasePackModel = model<BasePackDocument>(
  'BasePack',
  new Schema<BasePackSchema>({
    name: { type: String, trim: true, required: true },
    questionType: { type: Number, required: true },
    questions: [
      {
        id: { type: String, unique: true, required: true },
        translations: {
          en: { type: String, required: true },
          de: { type: String, required: true },
          es: { type: String, required: true },
        },
        choices: [
          {
            type: Number,
            required: false,
            default: [0, 0],
          },
        ],
      },
    ],
  })
);
