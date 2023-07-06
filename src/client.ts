import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import {
  BaseInteraction,
  Client,
  Collection,
  GatewayIntentBits,
  Options,
} from 'discord.js';

import config from '@config';
import {
  ExportedCoreButton,
  ExportedCoreCommand,
  ExportedCoreEvent,
  ExportedCoreModal,
  IExtendedClient,
} from '@typings/core';
import { logger } from '@utils/client';
import { clientError } from '@utils/client/errorHandler';
import {
  GuildProfiles,
  QuestionPacks,
  Translations,
  Webhooks,
} from '@utils/managers';

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
export class ExtendedClient extends Client implements IExtendedClient {
  // Client variables
  public botStartTime = new Date().getTime();
  public synced = false;
  public databaseLatency = 0;
  public developers: string[] = [];
  public cluster = new ClusterClient(this);
  public translations = new Translations();

  // Classes
  public commands = new Collection<string, ExportedCoreCommand>();
  public buttons = new Collection<string, ExportedCoreButton>();
  public modals = new Collection<string, ExportedCoreModal>();
  public events = new Collection<string, ExportedCoreEvent>();
  public guildProfiles;
  public packs;
  public webhooks;

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

    const guildIds = this.guilds.cache.map((guild) => guild.id);

    // Initialize classes
    this.cluster = new ClusterClient(this);
    this.guildProfiles = new GuildProfiles(guildIds);
    this.packs = new QuestionPacks(guildIds);
    this.webhooks = new Webhooks(guildIds);

    // TODO: Replace these
    /*
    this.voteLogger = new VoteLogger(this);
    if (this.cluster.id === 0) this.voteLogger.startAPI();

    this.voting = new Voting(this);
    this.voting.start(); */
  }

  // Client functions - Initialized after the client is initialized
  public logger = logger;
  /**
   * Log an error.
   * @param params The parameters for the error.
   */
  public error = async (params: ClientErrorParams): Promise<void> => {
    await clientError(this, params);
  };

  /**
   * Authenticate the client.
   * @returns The client.
   */
  public authenticate(): Promise<string> {
    return this.login(config.BOT_TOKEN);
  }

  /**
   * Set whether the client is synced with the database.
   * @param synced Whether the client is synced with the database.
   */
  public setSynced(synced: boolean): void {
    this.synced = synced;
  }

  /**
   * Check if the client is synced with the database - used to prevent code from running unless client is synced with database.
   * @returns Whether the client is synced with the database.
   */
  public ensureDatabaseSynced(): Promise<boolean> {
    return new Promise((resolve) => {
      /**
       * Check if the client is synced with the database.
       */
      const checkSynced = (): void => {
        if (this.synced) resolve(true);
        else setTimeout(checkSynced, 1); // check every 10ms
      };
      checkSynced();
    });
  }

  /**
   * Set the developers.
   * @param developers The developers.
   */
  public setDevelopers(developers: string[]): void {
    this.developers = developers;
  }
}

export default {};
