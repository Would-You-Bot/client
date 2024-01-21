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
import Voting from "./votingHandler";
import { Button, ChatInputCommand } from "../models";
import { fileToCollection } from "./Functions/fileToCollection";
import path from "path";
import { Event } from "../models/event";
// User filter to filter all users out of the cache expect the bot
//const userFilter = (u) => u?.id !== client?.user?.id;

export default class WouldYou extends Client {
  public commands: Collection<string, ChatInputCommand>;
  public buttons: Collection<string, Button>;
  public events: Collection<string, Event>;
  public used: Map<any, any>;
  readonly paginate: Collection<string, any>;
  readonly customAdd: Collection<string, any>;
  readonly cluster: ClusterClient<Client>;
  readonly cooldownHandler: CooldownHandler;
  readonly database: DatabaseHandler;
  readonly translation: TranslationHandler;
  readonly webhookHandler: WebhookHandler;
  readonly keepAlive: KeepAlive;
  readonly dailyMessage: DailyMessage;
  readonly voting: Voting;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
      ],
      makeCache: (manager) => {
        switch (manager.name) {
          case "ThreadMemberManager":
          case "ApplicationCommandManager":
          case "BaseGuildEmojiManager":
          case "GuildEmojiManager":
          case "GuildInviteManager":
          case "GuildStickerManager":
          case "StageInstanceManager":
          case "PresenceManager":
          case "MessageManager":
          case "GuildBanManager":
          case "ThreadManager":
          case "ReactionUserManager":
          case "VoiceStateManager":
          case "AutoModerationRuleManager":
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
    console.log(getInfo());
    // Allows for paginating
    this.paginate = new Collection();

    // For accepting or declining of adding text to custom text
    this.customAdd = new Collection();

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

    // Daily Message
    this.dailyMessage = new DailyMessage(this);
    this.dailyMessage.listen();

    this.voting = new Voting(this);
    this.voting.start();
  }

  async initialize() {
    function getPath(folder: string): string {
      return path.join(__dirname, "..", folder);
    }

    this.commands = await fileToCollection<ChatInputCommand>(
      getPath("commands"),
    );
    this.buttons = await fileToCollection<Button>(getPath("buttons"));
    this.events = await fileToCollection<Event>(getPath("events"));

    this.events.forEach((value, key) => {
      this.on(key, (payload) => value.execute(this, payload));
    });
  }

  /**
   * Login the bot client
   */
  async loginBot() {
    await this.initialize();
    return this.login(process.env.DISCORD_TOKEN);
  }
}
