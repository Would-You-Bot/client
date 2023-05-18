import { Events, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface CoreCron {
  name: string;
  execute: (...parameters: unknown[]) => Promise<undefined>; // defined the class in the cron file
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
