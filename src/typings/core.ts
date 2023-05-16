import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

import { ExtendedClient } from 'src/client';

export interface CoreEvent {
  disabled?: boolean;
  once?: boolean;
  name: Events;
  execute: (client: ExtendedClient, ...args: unknown[]) => Promise<unknown>;
}

export interface CoreButton {
  disabled?: boolean;
  id: string;
  description: string;
  execute: (
    interaction: ButtonInteraction,
    client: ExtendedClient,
    ...args: unknown[]
  ) => Promise<unknown>;
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
  execute: (
    interaction: ChatInputCommandInteraction,
    client: ExtendedClient,
    ...args: unknown[]
  ) => Promise<unknown>;
}
