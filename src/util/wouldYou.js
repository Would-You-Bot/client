// Main Bot Librarys
const {
  Client,
  GatewayIntentBits,
  Options,
  Collection,
  LimitedCollection,
} = require("discord.js");
const { getInfo, ClusterClient } = require("discord-hybrid-sharding");

// Utils and Config
const { ChalkAdvanced } = require("chalk-advanced");
require("dotenv").config();

// Classes for the bot
const TranslationHandler = require("./translationHandler");
const DatabaseHandler = require("./databaseHandler");
const KeepAlive = require("./keepAlive");
const ButtonHandler = require("./buttonHandler");
const EventHandler = require("./eventHandler");
const WebhookHandler = require("./webhookHandler");
const CooldownHandler = require("./cooldownHandler");
const DailyMessage = require("./dailyMessage");
const VoteLogger = require("./voteLogger");
const Voting = require("./votingHandler");

// User filter to filter all users out of the cache expect the bot
const userFilter = (u) => u?.id !== client?.user?.id;

module.exports = class WouldYou extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      makeCache: (manager) => {
        switch (manager.name) {
          case "GuildApplicationCommandManager":
          case "ApplicationCommandPermissionsManager":
          case "ThreadMemberManager":
          case "ApplicationCommandManager":
          case "BaseGuildEmojiManager":
          case "GuildEmojiManager":
          case "GuildEmojiRoleManager":
          case "GuildInviteManager":
          case "GuildStickerManager":
          case "StageInstanceManager":
          case "PresenceManager":
          case "MessageManager":
          case "GuildBanManager":
          case "ThreadManager":
          case "ReactionUserManager":
            return new LimitedCollection({ maxSize: 0 });
          case "GuildMemberManager":
            return new LimitedCollection({
              maxSize: 20000,
              keepOverLimit: (member) => member.id === member.client.user.id,
            });
          case "UserManager":
            return new LimitedCollection({
              maxSize: 20000,
              keepOverLimit: (user) => user.id === user.client.user.id,
            });
          default:
            return new Collection();
        }
      },
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });

    // It's creating a new collection for the commands.
    this.commands = new Collection();

    // Allows for paginating
    this.paginate = new Collection();

    // The cooldown handler
    this.cooldownHandler = new CooldownHandler(this);
    this.cooldownHandler.startSweeper();

    // Init the cluster client
    this.cluster = new ClusterClient(this);

    // The database handler
    this.database = new DatabaseHandler(process.env.MONGO_URI);
    this.database.connectToDatabase().then(() => {
      console.log(
        `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
          ">",
        )} ${ChalkAdvanced.green("Successfully connected to the database")}`,
      );
    });
    this.database.startSweeper();

    // The translations handler
    this.translation = new TranslationHandler();

    // Webhook Manager
    this.webhookHandler = new WebhookHandler(this);

    // Keep Alive system after the necessary things that are allowed to crash are loaded
    this.keepAlive = new KeepAlive(this);
    this.keepAlive.start();

    //Vote Logger
    this.voteLogger = new VoteLogger(this);
    if (this?.cluster?.id === 0) {
      this.voteLogger.startAPI();
    }

    // Button Loader
    this.buttonHandler = new ButtonHandler(this);
    this.buttonHandler.load();

    // Events Loader
    this.eventHandler = new EventHandler(this);
    this.eventHandler.load();

    // Daily Message
    this.dailyMessage = new DailyMessage(this);
    this.dailyMessage.start();

    this.voting = new Voting(this);
    this.voting.start();
  }

  /**
   * Login the bot client
   */
  loginBot() {
    return this.login(process.env.DISCORD_TOKEN);
  }
};
