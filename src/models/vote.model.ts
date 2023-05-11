import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

interface VoteSchema extends SchemaTimestampsConfig {
  id: string;
  guild: string;
  channel: string;
  type: number;
  votes: {
    op_one: string[];
    op_two: string[];
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
      type: { type: Number, default: 0 }, // 0 = wouldyourather, 1 = neverhaveiever
      votes: {
        op_one: { type: Array, default: [] },
        op_two: { type: Array, default: [] },
      },

      until: { type: Date, required: false },
    },
    { timestamps: true }
  )
);
