import { Schema, model } from "mongoose";

export interface IHigherLowerModel {
	creator: string;
	created: Date;
	id: string;
	guild: string;
	items: {
		current: {
			id: string;
			keyword: string;
			value: number;
			author: string;
			link: string;
		};
		history: Array<{
			id: string;
			keyword: string;
			value: number;
			author: string;
			link: string;
		}>;
	};
	score: number;
}

const higherlowerModelSchema = new Schema<IHigherLowerModel>(
	{
		creator: { type: String, required: true },
		created: { type: Date, required: true },
		id: { type: String, required: true },
		guild: { type: String, required: true },
		items: {
			current: {
				id: { type: String, required: true },
				keyword: { type: String, required: true },
				value: { type: Number, required: true },
				author: { type: String, required: true },
				link: { type: String, required: true },
			},
			history: [
				{
					id: { type: String, required: true },
					keyword: { type: String, required: true },
					value: { type: Number, required: true },
					author: { type: String, required: true },
					link: { type: String, required: true },
				},
			],
		},
		score: { type: Number, required: true },
	},
	{ timestamps: true },
);

export const HigherlowerModel = model<IHigherLowerModel>("higherlowerModel", higherlowerModelSchema);
