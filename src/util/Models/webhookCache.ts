import { Schema, model } from "mongoose";

export interface IWebhookCache{
  channelId: string,
  webhookId: string,
  webhookToken: string
}

const webhookCacheSchema = new Schema({
  channelId: {
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
});

export const WebhookCache = model<IWebhookCache>("webhookCache", webhookCacheSchema);
