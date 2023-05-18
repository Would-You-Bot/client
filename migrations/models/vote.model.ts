import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

/* eslint-disable no-shadow */
enum VoteType {
  WouldYouRather = 0,
  NeverHaveIEver = 1,
}

interface VoteSchema extends SchemaTimestampsConfig {
  id: string;
  guild: string;
  channel: string;
  type: VoteType;
  votes: {
    optionOne: string[];
    optionTwo: string[];
  };
  until: Date;
}

type VoteDocument = VoteSchema & Document;

export default model<VoteDocument>(
  'voteModel',
  new Schema<VoteSchema>(
    {
      id: { type: String, required: true },
      guild: { type: String, required: false },
      channel: { type: String, required: true },
      type: {
        type: Number,
        enum: [VoteType.WouldYouRather, VoteType.NeverHaveIEver],
        default: VoteType.WouldYouRather,
      },
      votes: {
        optionOne: { type: [String], default: [] },
        optionTwo: { type: [String], default: [] },
      },
      until: { type: Date, required: false },
    },
    { timestamps: true }
  )
);
