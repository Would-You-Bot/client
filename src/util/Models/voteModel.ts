import { Schema, model } from "mongoose";

export interface IVoteModel {
	id: string;
	guild: string;
	channel: string;
	type: string;
	votes: {
		op_one: string[];
		op_two: string[];
	};
	until: Date;
}
const voteModelSchema = new Schema(
	{
		id: { type: String, required: true },
		guild: { type: String, required: false },
		channel: { type: String, required: true },
		type: { type: String }, // 0 = wouldyourather, 1 = neverhaveiever
		votes: {
			op_one: { type: [String], default: [] },
			op_two: { type: [String], default: [] },
		},

		until: { type: Date, required: false },
	},
	{ timestamps: true },
);

export const VoteModel = model<IVoteModel>("voteModel", voteModelSchema);
