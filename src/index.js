const { Client, GatewayIntentBits, Options } = require('discord.js');

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
  }
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
});

const wouldyouComponents = async () => {
  client.database = require('./util/dbHandler');
  await client.database.connectToDatabase();

  require('./util/keepAlive')(client);
  await require('./util/wouldyouClient')(client);
  await require('./util/voteLogs');
};

wouldyouComponents();
