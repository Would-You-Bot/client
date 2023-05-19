import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

import { CoreLanguage } from '@typings/core';
import { GuildProfile } from '@typings/guild';

export interface GuildProfileSchema extends GuildProfile, SchemaTimestampsConfig {}

export type GuildProfileDocument = HydratedDocument<GuildProfileSchema>;

export const GuildProfileModel = model<GuildProfileDocument>(
  'GuildProfile',
  new Schema<GuildProfileSchema>(
    {
      guildId: {
        type: String,
        required: true,
        unique: true,
      },
      timezone: {
        type: String,
        default: 'America/Chicago',
      },
      language: {
        type: String,
        default: CoreLanguage.English,
        required: true,
      },
      premium: {
        enabled: {
          type: Boolean,
          default: false,
        },
        permanent: {
          type: Boolean,
          default: false,
        },
        expires: {
          type: Date,
          required: false,
        },
      },
      welcome: {
        enabled: {
          type: Boolean,
          default: false,
        },
        channel: {
          type: String,
          required: false,
        },
        ping: {
          type: Boolean,
          required: false,
        },
      },
      daily: {
        enabled: {
          type: Boolean,
          default: false,
        },
        channel: {
          type: String,
          required: false,
        },
        role: {
          type: String,
          required: false,
        },
        interval: {
          type: String,
          default: '12:00',
        },
        thread: {
          type: Boolean,
          required: false,
        },
      },
      botJoined: {
        type: Number,
      },
      debug: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);
