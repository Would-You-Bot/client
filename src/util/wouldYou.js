// Main Bot Library's
const {Client, GatewayIntentBits, Options, Collection} = require("discord.js");
const {getInfo, ClusterClient} = require("discord-hybrid-sharding");

// Utils anc Config
const {ChalkAdvanced} = require("chalk-advanced");
require('dotenv').config();

// Classes for the bot
const TranslationHandler = require("./translationHandler");
const DatabaseHandler = require("./databaseHandler");
const KeepAlive = require('./keepAlive');
const ButtonHandler = require("./buttonHandler");
const EventHandler = require("./eventHandler");
const WebhookHandler = require("./webhookHandler");
const CooldownHandler = require("./cooldownHandler");
const DailyMessage = require("./dailyMessage");
const VoteLogger = require("./voteLogger");
const Voting = require("./VotingHandler");


// User filter to filter all users out of the cache expect the bot
const userFilter = (u) => u?.id !== client?.user?.id;

module.exports = class WouldYou extends Client {
    constructor(customCacheOptions = {}) {
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
                ...customCacheOptions,
            }),
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
        });

        // It's creating a new collection for the commands.
        this.commands = new Collection();

        // The cooldown handler
        this.cooldownHandler = new CooldownHandler(this);
        this.cooldownHandler.startSweeper();

        // Init the cluster client
        this.cluster = new ClusterClient(this);

        // The database handler
        this.database = new DatabaseHandler(process.env.MONGO_URI);
        this.database.connectToDatabase().then(() => {
            console.log(
                `${ChalkAdvanced.white('Would You?')} ${ChalkAdvanced.gray(
                    '>',
                )} ${ChalkAdvanced.green('Successfully connected to the database')}`,
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
        if(this?.cluster?.id === 0) {
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

        // Voting System
        this.voting = new Voting(this);
        this.voting.start();
    }

    /**
     * Login the bot client
     */
    loginBot() {
        return this.login(process.env.DISCORD_TOKEN);
    }
}
