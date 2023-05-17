import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

export interface WebhookSchema extends SchemaTimestampsConfig {
  guildId: string;
  channelId: string;
  webhook: {
    id: string;
    token: string;
  };
}

export interface WebhookDocument extends WebhookSchema, Document {}

export default model<WebhookDocument>(
  'webhook',
  new Schema<WebhookSchema>(
    {
      guildId: { type: String, required: true },
      channelId: { type: String, required: true },
      webhook: {
        id: { type: String, required: true },
        token: { type: String, required: true },
      },
    },
    { timestamps: true }
  )
);
