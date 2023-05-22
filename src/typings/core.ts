/* eslint-disable import/export */
import { ClusterClient, DjsDiscordClient } from 'discord-hybrid-sharding';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  Client,
  Collection,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Events,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  User,
} from 'discord.js';
import { Logger } from 'winston';

import { GuildProfile, GuildProfiles, QuestionPacks, Translations, Webhooks } from '@utils/classes';

interface ClientErrorParams {
  error: Error | string;
  title?: string;
  description?: string;
  footer?: string;
  interaction?: BaseInteraction;
}

export interface IExtendedClient extends Client {}

export interface CoreCron {
  id: string;
  name: string;
  expression: string;
  timezone: string;
  execute: (client: IExtendedClient) => Promise<unknown>;
  disabled?: boolean;
}

export interface CoreCustomCron {
  id: string;
  name: string;
  execute: (client: IExtendedClient) => Promise<unknown>;
  disabled?: boolean;
}

export interface CoreEvent<P extends unknown[] = unknown[]> {
  once?: boolean;
  name: Events | Events.Raw | Events.VoiceServerUpdate;
  execute: (client: IExtendedClient, ...params: P) => Promise<unknown> | unknown;
  disabled?: boolean;
}

export interface CoreButton {
  id: string;
  description: string;
  execute: (client: IExtendedClient, interaction: ButtonInteraction, args?: string[]) => Promise<unknown> | unknown;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

export interface CoreModal {
  id: string;
  description: string;
  execute: (
    client: IExtendedClient,
    interaction: ModalSubmitInteraction,
    args?: string[]
  ) => Promise<unknown> | unknown;
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
  execute: (client: IExtendedClient, ...parameters: unknown[]) => Promise<unknown>;
  autocomplete: (client: IExtendedClient, ...parameters: unknown[]) => Promise<unknown>;
  disabled?: boolean;
  developer?: boolean;
}

export interface CoreContextMenuCommand {
  data: ContextMenuCommandBuilder;
  execute: (client: IExtendedClient, ...parameters: unknown[]) => Promise<unknown>;
  disabled?: boolean;
  developer?: boolean;
}

export type CoreInterface = (
  client: IExtendedClient,
  guildProfile: GuildProfile,
  params?: Record<string, unknown>
) => {
  content?: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder<ButtonBuilder>[];
  files?: AttachmentBuilder[];
};

export interface IExtendedClient extends Client {
  botStartTime: number;
  synced: boolean;
  databaseLatency: number;
  developers: User[];
  cluster: ClusterClient<DjsDiscordClient>;
  translations: Translations;

  slashCommands: Collection<string, CoreSlashCommand>;
  contextMenuCommands: Collection<string, CoreContextMenuCommand>;
  buttons: Collection<string, CoreButton>;
  modals: Collection<string, CoreModal>;
  events: Collection<string, CoreEvent>;

  guildProfiles: GuildProfiles;
  packs: QuestionPacks;
  webhooks: Webhooks;

  logger: Logger;
  error: (params: ClientErrorParams) => Promise<void>;

  authenticate: () => Promise<string>;
  isSynced: () => Promise<boolean>;
}
