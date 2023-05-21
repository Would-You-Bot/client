import { ContextMenuCommandBuilder, Events, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface CoreCron<T = unknown> {
  id: string;
  name: string;
  expression: string;
  timezone: string;
  execute: (client: T) => Promise<unknown>;
  disabled?: boolean;
}

export interface CoreCustomCron<T = unknown> {
  id: string;
  name: string;
  execute: (client: T) => Promise<unknown>;
  disabled?: boolean;
}

export interface CoreEvent<T = unknown, P extends unknown[] = unknown[]> {
  once?: boolean;
  name: Events;
  execute: (client: T, ...params: P) => Promise<unknown> | unknown;
  disabled?: boolean;
}

export interface CoreButton {
  id: string;
  description: string;
  execute: (...parameters: unknown[]) => Promise<unknown>;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

export interface CoreSlashCommand {
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
  autocomplete: (...parameters: unknown[]) => Promise<unknown>;
  disabled?: boolean;
  developer?: boolean;
}

export interface CoreContextMenuCommand {
  data: ContextMenuCommandBuilder;
  execute: (...parameters: unknown[]) => Promise<unknown>;
  autocomplete: (...parameters: unknown[]) => Promise<unknown>;
  disabled?: boolean;
  developer?: boolean;
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
