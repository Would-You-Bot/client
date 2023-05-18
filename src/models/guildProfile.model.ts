import { HydratedDocument, Schema, SchemaTimestampsConfig, model } from 'mongoose';

import { CoreLanguage } from '@typings/core';
import { AllGuildQuestionTypes, GuildProfile, GuildQuestionType } from '@typings/guild';

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
      language: {
        type: String,
        default: CoreLanguage.English,
        required: true,
      },
      questionType: {
        type: Number,
        enum: AllGuildQuestionTypes,
        default: GuildQuestionType.Default,
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
        timezone: {
          type: String,
          default: 'America/Chicago',
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
      replay: {
        enabled: {
          type: Boolean,
          default: true,
        },
        cooldown: {
          type: Number,
          default: 30000,
        },
        type: {
          type: String,
          default: 'Guild',
        },
        channels: {
          type: [
            {
              id: {
                type: String,
                required: true,
              },
              name: {
                type: String,
                required: true,
              },
              cooldown: {
                type: Number,
                required: true,
              },
            },
          ],
          default: [],
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
