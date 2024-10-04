import { Schema, model } from "mongoose";

export interface IWebhookCache {
	channelId: string;
	guildId: string;
	webhookId: string;
	webhookToken: string;
	lastUsageTimestamp: number;
}

const webhookCacheSchema = new Schema({
	channelId: {
		type: String,
		default: null,
	},
	guildId: {
		type: String,
		default: null,
	},
	webhookId: {
		type: String,
		default: null,
	},
	webhookToken: {
		type: String,
		default: null,
	},
	lastUsageTimestamp: {
		type: Number,
		default: 0,
	},
});

export const WebhookCache = model<IWebhookCache>("webhookCache", webhookCacheSchema);
