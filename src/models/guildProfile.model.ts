import {
  HydratedDocument,
  Schema,
  SchemaTimestampsConfig,
  model,
} from 'mongoose';

import {
  AllGuildQuestionTypes,
  GuildLanguage,
  GuildPackType,
  GuildProfile,
} from '@typings/guild';

export interface GuildProfileSchema
  extends GuildProfile,
    SchemaTimestampsConfig {}

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
        required: true,
      },
      language: {
        type: String,
        default: GuildLanguage.English,
        required: true,
      },
      packType: {
        type: Number,
        enum: AllGuildQuestionTypes,
        default: GuildPackType.Base,
        required: true,
      },
      premium: {
        enabled: {
          type: Boolean,
          default: false,
          required: true,
        },
        permanent: {
          type: Boolean,
          default: false,
          required: true,
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
          required: true,
        },
        channel: {
          type: String,
          required: false,
        },
        ping: {
          type: Boolean,
          required: true,
        },
      },
      daily: {
        enabled: {
          type: Boolean,
          default: false,
          required: true,
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
          required: true,
        },
        thread: {
          type: Boolean,
          required: true,
        },
      },
      botJoined: {
        type: Number,
        default: Date.now(),
        required: true,
      },
      botLeft: {
        type: Number,
      },
      debug: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    { timestamps: true }
  )
);
