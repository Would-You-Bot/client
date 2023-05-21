import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

import { CoreWebhook } from '@typings/core';

export interface WebhookSchema extends CoreWebhook, SchemaTimestampsConfig {}

export type WebhookDocument = HydratedDocument<WebhookSchema>;

export const WebhookModel = model<WebhookDocument>(
  'webhook',
  new Schema<WebhookSchema>(
    {
      guildId: { type: String, index: true, required: true },
      channelId: { type: String, index: true, unique: true, required: true },
      data: {
        id: { type: String, required: true },
        token: { type: String, required: true },
      },
    },
    { timestamps: true }
  )
);
