import {
  ButtonInteraction,
  ContextMenuCommandBuilder,
  Events,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

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
  name: Events | Events.Raw | Events.VoiceServerUpdate;
  execute: (client: T, ...params: P) => Promise<unknown> | unknown;
  disabled?: boolean;
}

export interface CoreButton<T = unknown, I = ButtonInteraction, A = string[]> {
  id: string;
  description: string;
  execute: (client: T, interaction: I, args: A) => Promise<unknown> | unknown;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

export interface CoreModal<T = unknown, I = ModalSubmitInteraction, A = string[]> {
  id: string;
  description: string;
  execute: (client: T, interaction: I, args?: A) => Promise<unknown> | unknown;
  disabled?: boolean;
  developer?: boolean;
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
