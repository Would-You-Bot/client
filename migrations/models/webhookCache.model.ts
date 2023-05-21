import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

interface WebhookCacheSchema extends SchemaTimestampsConfig {
  channelId: string;
  webhookId: string;
  webhookToken: string;
}

type WebhookCacheDocument = WebhookCacheSchema & Document;

export default model<WebhookCacheDocument>(
  'webhookCache',
  new Schema<WebhookCacheSchema>({
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
  })
);
