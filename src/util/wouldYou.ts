// Main Bot Librarys
import {
  Client,
  GatewayIntentBits,
  Collection,
  LimitedCollection,
} from "discord.js";
import { getInfo, ClusterClient } from "discord-hybrid-sharding";

// Utils and Config
import { gray, white, green } from "chalk-advanced";
import "dotenv/config";

// Classes for the bot
import TranslationHandler from "./translationHandler";
import DatabaseHandler from "./databaseHandler";
import KeepAlive from "./keepAlive";
import WebhookHandler from "./webhookHandler";
import CooldownHandler from "./cooldownHandler";
import DailyMessage from "./dailyMessage";
import VoteLogger from "./voteLogger";
import Voting from "./votingHandler";
import { handleGuildCreate } from "../events/guildCreate";
import { handleReady } from "../events/ready";
import { handleShardReady } from "../events/shardReady";
import { handleGuildDelete } from "../events/guildDelete";
import { handleGuildMemberAdd } from "../events/guildMemberAdd";
import { handleInteractionCreate } from "../events/interactionCreate";
import { handleMessageCreate } from "../events/messageCreate";
import { handleShardReconnecting } from "../events/shardReconnecting";
import { handleShardResume } from "../events/shardResume";
import { Button, ChatInputCommand } from "../models";
import { fileToCollection } from "./Functions/fileToCollection";
import path from "path";
// User filter to filter all users out of the cache expect the bot
//const userFilter = (u) => u?.id !== client?.user?.id;

export default class WouldYou extends Client {
  public commands: Collection<string, ChatInputCommand>;
  public buttons: Collection<string, Button>;
  readonly paginate: Collection<any, any>;
  readonly cluster: ClusterClient<Client>;
  readonly cooldownHandler: CooldownHandler;
  readonly database: DatabaseHandler;
  readonly translation: TranslationHandler;
  readonly webhookHandler: WebhookHandler;
  readonly keepAlive: KeepAlive;
  readonly voteLogger: VoteLogger;
  readonly dailyMessage: DailyMessage;
  readonly voting: Voting;
  public used: any;

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
    const commandPath = path.join(__dirname, "..", "commands"),
      buttonPath = path.join(__dirname, "..", "buttons");
    this.commands = fileToCollection<ChatInputCommand>(commandPath);
    this.buttons = fileToCollection<Button>(buttonPath);

    // Allows for paginating
    this.paginate = new Collection();

    // The cooldown handler
    this.cooldownHandler = new CooldownHandler(this);
    this.cooldownHandler.startSweeper();

    // Init the cluster client
    this.cluster = new ClusterClient(this);

    // The database handler
    this.database = new DatabaseHandler(process.env.MONGO_URI as string);
    this.database.connectToDatabase().then(() => {
      console.log(
        `${white("Would You?")} ${gray(">")} ${green(
          "Successfully connected to the database",
        )}`,
      );
    });
    this.database.startSweeper(this);

    // The translations handler
    this.translation = new TranslationHandler();

    // Webhook Manager
    this.webhookHandler = new WebhookHandler(this);

    // Keep Alive system after the necessary things that are allowed to crash are loaded
    this.keepAlive = new KeepAlive(this);
    this.keepAlive.start();
    /*
    //ToDo: Inspect why its crashing the whole process
    //Vote Logger
    this.voteLogger = new VoteLogger(this);
    if (this?.cluster?.id === 0) {
      //this.voteLogger.startAPI();
    }

    // Button Loader
    this.buttonHandler = new ButtonHandler(this);
    this.buttonHandler.load();
    */

    // Events Loader
    this.on("guildCreate", (guild) => handleGuildCreate(this, guild));
    this.on("ready", (client) => handleReady(client as WouldYou));
    this.on("shardReady", (shardId) => handleShardReady(this, shardId));
    this.on("shardReconnecting", (shardId) =>
      handleShardReconnecting(this, shardId),
    );
    this.on("shardResume", (shardId) => handleShardResume(this, shardId));
    this.on("guildDelete", (guild) => handleGuildDelete(this, guild));
    this.on("guildMemberAdd", (member) => handleGuildMemberAdd(this, member));
    this.on("interactionCreate", (interaction) =>
      handleInteractionCreate(this, interaction),
    );
    this.on("messageCreate", (message) => handleMessageCreate(this, message));

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
}
