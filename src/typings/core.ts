import { Events, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface CoreCron<T = unknown> {
  id: string;
  name: string;
  expression: string;
  timezone: string;
  execute: (client: T) => Promise<void>;
}

export interface CoreCustomCron<T = unknown> {
  id: string;
  name: string;
  execute: (client: T) => Promise<void>;
}

export interface CoreEvent {
  disabled?: boolean;
  once?: boolean;
  name: Events;
  execute: (...parameters: unknown[]) => Promise<unknown>;
}

export interface CoreButton {
  disabled?: boolean;
  id: string;
  description: string;
  execute: (...parameters: unknown[]) => Promise<unknown>;
}

export interface CoreCommand {
  disabled?: boolean;
  data:
    | Omit<
        SlashCommandBuilder,
        | 'addSubcommand'
        | 'addSubcommandGroup'
        | 'addBooleanOption'
        | 'addUserOption'
        | 'addChannelOption'
        | 'addRoleOption'
        | 'addMentionableOption'
        | 'addNumberOption'
        | 'addIntegerOption'
        | 'addStringOption'
        | 'addChoices'
      >
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (...parameters: unknown[]) => Promise<unknown>;
}

export interface CoreWebhook {
  guildId: string;
  channelId: string;
  data: {
    id: string;
    token: string;
  };
}

export enum CoreLanguage {
  English = 'en',
  German = 'de',
  Spanish = 'es',
}
