import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Events,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { ExtendedClient } from 'src/client';

export interface CoreEvent {
  once?: boolean;
  name: Events;
  execute: (client: ExtendedClient, ...args: any) => Promise<any>;
}

export interface CoreButton {
  name: string;
  description: string;
  execute: (
    interaction: ButtonInteraction,
    client: ExtendedClient,
    ...args: any[]
  ) => Promise<any>;
}

export interface CoreCommand {
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
    ...args: any[]
  ) => Promise<any>;
}
