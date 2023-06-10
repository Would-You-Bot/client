import {
  HydratedDocument,
  Schema,
  SchemaTimestampsConfig,
  model,
} from 'mongoose';

import { CustomPack } from '@typings/pack';

export interface CustomPackSchema extends CustomPack, SchemaTimestampsConfig {}

export type CustomPackDocument = HydratedDocument<CustomPackSchema>;

export const CustomPackModel = model<CustomPackDocument>(
  'CustomPack',
  new Schema<CustomPackSchema>({
    userId: { type: String, required: true },
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    tags: { type: [String], default: [], max: 5 },
    likes: { type: [String], default: [] },
    questions: [
      {
        id: { type: String, unique: true, required: true },
        questionType: { type: Number, required: true },
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
    visible: { type: Boolean, default: true },
  })
);
