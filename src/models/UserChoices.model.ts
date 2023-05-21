import { UserChoices } from '@typings/pack';
import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

export interface UserChoicesSchema extends UserChoices, SchemaTimestampsConfig {}

export type UserChoicesDocument = HydratedDocument<UserChoicesSchema>;

export const UserChoicesModel = model<UserChoicesDocument>(
  'UserChoices',
  new Schema<UserChoicesSchema>(
    {
      packId: {
        type: String,
        required: true,
      },
      questionId: {
        type: String,
        required: true,
      },
      custom: {
        type: Boolean,
        required: true,
      },
      choices: {
        first: {
          type: [String],
          required: true,
          default: [],
        },
        second: {
          type: [String],
          required: true,
          default: [],
        },
      },
    },
    { timestamps: true }
  )
);
