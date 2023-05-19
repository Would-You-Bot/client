import { ClusterClient, DjsDiscordClient, getInfo } from 'discord-hybrid-sharding';
import { BaseInteraction, Client, Collection, GatewayIntentBits, Options, User } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

import config from '@config';
import { CoreButton, CoreCommand, CoreEvent } from '@typings/core';
import { GuildProfiles, Webhooks } from '@utils/classes';
import { Logger } from 'winston';

interface ClientErrorParams {
  error: Error | string;
  title?: string;
  description?: string;
  footer?: string;
  interaction?: BaseInteraction;
}

/**
 * A custom class representing the discord client.
 */
export class ExtendedClient extends Client {
  // Client variables
  public botStartTime: number = new Date().getTime();
  public synced = false; // Value for client to know if its synced with database
  public databaseLatency = 0;
  public developers: User[] = [];
  public client: ClusterClient<Client>;
  public cluster: ClusterClient<DjsDiscordClient>;

  // Client functions - Initialized after the client is initialized
  public logger: Logger;
  public error: (params: ClientErrorParams) => Promise<undefined>;

  // Classes
  public commands = new Collection<string, CoreCommand>();
  public buttons = new Collection<string, CoreButton>();
  public events = new Collection<string, CoreEvent>();
  public guildProfiles: GuildProfiles;
  public webhooks: Webhooks;
  public used = new Map<string, unknown>();

  /**
   * Create a new client instance.
   * @param customCacheOptions Custom cache options.
   */
  public constructor(customCacheOptions = {}) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      makeCache: Options.cacheWithLimits({
        BaseGuildEmojiManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildStickerManager: 0,
        PresenceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        MessageManager: 0,
        ReactionUserManager: {
          maxSize: 1000000,
        },
        UserManager: {
          maxSize: 1000000,
        },
        GuildMemberManager: {
          maxSize: 1000000,
        },
        ...customCacheOptions,
      }),
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    // Initialize classes
    this.cluster = new ClusterClient(this);
    this.guildProfiles = new GuildProfiles(this.guilds.cache.map((guild) => guild.id));
    this.webhooks = new Webhooks(this.guilds.cache.map((guild) => guild.id));

    // TODO: Replace these
    /* this.dailyMessage = new DailyMessage(this);
    this.dailyMessage.start();

    this.voteLogger = new VoteLogger(this);
    if (this.cluster.id === 0) this.voteLogger.startAPI();

    this.voting = new Voting(this);
    this.voting.start(); */
  }

  /**
   * Authenticate the client.
   * @returns The client.
   */
  public authenticate() {
    return this.login(config.BOT_TOKEN);
  }

  /**
   * Check if the client is synced with the database - used to prevent code from running unless client is synced with database.
   * @returns Whether the client is synced with the database.
   */
  public get isSynced() {
    return this.synced ? true : false;
  }
}

export default {};
