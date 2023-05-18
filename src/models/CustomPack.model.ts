import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

import { CustomPack } from '@typings/questions';

export interface CustomPackSchema extends CustomPack, SchemaTimestampsConfig {}

export type CustomPackDocument = HydratedDocument<CustomPackSchema>;

export const CustomPackModel = model<CustomPackDocument>(
  'CustomPack',
  new Schema<CustomPackSchema>({
    name: { type: String, trim: true, required: true },
    questionType: { type: Number, required: true },
    questions: [
      {
        id: { type: String, unique: true, required: true },
        text: { type: String, required: true },
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
