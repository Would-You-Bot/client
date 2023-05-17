import { Events, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface CoreEvent {
  disabled?: boolean;
  once?: boolean;
  name: Events;
  execute: (...args: unknown[]) => Promise<unknown>;
}

export interface CoreButton {
  disabled?: boolean;
  id: string;
  description: string;
  execute: (...args: unknown[]) => Promise<unknown>;
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
  execute: (...args: unknown[]) => Promise<unknown>;
}
