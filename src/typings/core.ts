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
  EmbedBuilder,
  Events,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  User,
} from 'discord.js';
import { Logger } from 'winston';

import {
  GuildProfile,
  GuildProfiles,
  QuestionPacks,
  Translations,
  Webhooks,
} from '@utils/managers';

/**
 * Client Error.
 */

interface ClientErrorParams {
  error: Error | string;
  title?: string;
  description?: string;
  footer?: string;
  interaction?: BaseInteraction;
}

export interface IExtendedClient extends Client {}

/**
 * Core Button.
 */

export type CoreButtonExecute = (
  client: IExtendedClient,
  interaction: ButtonInteraction,
  args: string[]
) => Promise<unknown> | unknown;

export interface CoreButtonOptions {
  id: string;
  description: string;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
  errorMessage?: string;
}

export interface ExportedCoreButton extends CoreButtonOptions {
  execute: CoreButtonExecute;
}

/**
 * Core Command.
 */

export type CoreCommandExecute = (
  client: IExtendedClient,
  ...parameters: unknown[]
) => Promise<unknown>;

export type CoreCommandAutocomplete = (
  client: IExtendedClient,
  ...parameters: unknown[]
) => Promise<unknown>;

export type CoreCommandData =
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

export interface CoreCommandOptions {
  data: CoreCommandData;
  disabled?: boolean;
  developer?: boolean;
}

export interface ExportedCoreCommand extends CoreCommandOptions {
  execute: CoreCommandExecute;
  autocomplete?: CoreCommandAutocomplete;
}

/**
 * Core Cron.
 */

export type CoreCronExecute = (client: IExtendedClient) => Promise<unknown>;

export interface CoreCronOptions {
  id: string;
  name: string;
  expression: string;
  timezone: string;
  disabled?: boolean;
}

export interface ExportedCoreCron extends CoreCronOptions {
  execute: CoreCronExecute;
}

export interface CoreCustomCronOptions {
  id: string;
  name: string;
  disabled?: boolean;
}

export interface ExportedCoreCustomCron extends CoreCustomCronOptions {
  execute: CoreCronExecute;
}

/**
 * Core Event.
 */

export type CoreEventExecute<P extends unknown[] = unknown[]> = (
  client: IExtendedClient,
  ...params: P
) => Promise<unknown> | unknown;

export type CoreEventName = Events | Events.Raw | Events.VoiceServerUpdate;

export interface CoreEventOptions {
  once?: boolean;
  name: CoreEventName;
  disabled?: boolean;
}

export interface ExportedCoreEvent<P extends unknown[] = unknown[]>
  extends CoreEventOptions {
  execute: CoreEventExecute<P>;
}

/**
 * Core Interface.
 */

export interface CoreInterfaceOptions {
  client?: IExtendedClient;
  guildProfile?: GuildProfile;
  interaction?: BaseInteraction;
  [key: string]: unknown;
}

interface CoreInterfaceResult {
  content?: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder<ButtonBuilder>[];
  files?: AttachmentBuilder[];
}

export type CoreInterfaceFunction<T = CoreInterfaceOptions> = (
  options: T
) => CoreInterfaceResult | Promise<CoreInterfaceResult>;

/**
 * Core Modal.
 */

type CoreModalExecute = (
  client: IExtendedClient,
  interaction: ModalSubmitInteraction,
  args?: string[]
) => Promise<unknown> | unknown;

export interface CoreModalOptions {
  id: string;
  description: string;
  disabled?: boolean;
  developer?: boolean;
}

export interface ExportedCoreModal extends CoreModalOptions {
  execute: CoreModalExecute;
}

/**
 * Core Select Menu.
 */

export interface IExtendedClient extends Client {
  botStartTime: number;
  synced: boolean;
  databaseLatency: number;
  developers: User[];
  cluster: ClusterClient<DjsDiscordClient>;
  translations: Translations;

  commands: Collection<string, CoreCommandOptions>;
  buttons: Collection<string, CoreButtonOptions>;
  modals: Collection<string, CoreModalOptions>;
  events: Collection<string, CoreEventOptions>;

  guildProfiles: GuildProfiles;
  packs: QuestionPacks;
  webhooks: Webhooks;

  logger: Logger;
  error: (params: ClientErrorParams) => Promise<void>;

  authenticate: () => Promise<string>;
  isSynced: () => Promise<boolean>;
}
