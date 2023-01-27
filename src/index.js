const {
  Client,
  GatewayIntentBits,
  Options
} = require('discord.js');
const {
  ClusterClient,
  getInfo
} = require('discord-hybrid-sharding');

// User filter to filter all users out of the cache expect the bot
const userFilter = (u) => u?.id !== client?.user?.id;

// Custom Cache Options
const cacheOptions = {
  BaseGuildEmojiManager: 0,
  GuildBanManager: 0,
  GuildInviteManager: 0,
  GuildStickerManager: 0,
  PresenceManager: 0,
  ThreadManager: 0,
  ThreadMemberManager: 0,
  CategoryChannelChildManager: 0,
  MessageManager: 0,
  ReactionUserManager: {
    maxSize: 1000000,
    sweepFilter: () => userFilter,
    sweepInterval: 5 * 60 * 1000,
  },
  UserManager: {
    maxSize: 1000000,
    sweepFilter: () => userFilter,
    sweepInterval: 5 * 60 * 1000,
  },
  GuildMemberManager: {
    maxSize: 1000000,
    sweepFilter: () => userFilter,
    sweepInterval: 5 * 60 * 1000,
  },
};

/* Initialize client */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  makeCache: Options.cacheWithLimits({
    ...cacheOptions,
  }),
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
});

const wouldyouComponents = async () => {
  // Cluster Init
  client.cluster = new ClusterClient(client);

  client.database = require('./util/dbHandler');
  await client.database.connectToDatabase();

  const TranslationHandler = require('./util/translationHandler');
  client.translation = new TranslationHandler();

  require('./util/keepAlive')(client);
  await require('./util/wouldyouClient')(client);
  if (client?.cluster?.id === 0) await require('./util/voteLogs');
};

wouldyouComponents();
