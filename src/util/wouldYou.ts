// Main Bot Librarys
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import {
  Client,
  Collection,
  GatewayIntentBits,
  LimitedCollection,
  Partials,
} from "discord.js";

// Utils and Config
import { gray, green, white } from "chalk-advanced";
import "dotenv/config";

// Classes for the bot
import path from "path";
import { Button, ChatInputCommand } from "../interfaces";
import { Event } from "../interfaces/event";
import { fileToCollection } from "./Functions/fileToCollection";
import CooldownHandler from "./cooldownHandler";
import DailyMessage from "./dailyMessage";
import DatabaseHandler from "./databaseHandler";
import KeepAlive from "./keepAlive";
import TranslationHandler from "./translationHandler";
import Voting from "./votingHandler";
import WebhookHandler from "./webhookHandler";

export default class WouldYou extends Client {
  public commands: Collection<string, ChatInputCommand>;
  public buttons: Collection<string, Button>;
  public events: Collection<string, Event>;
  public used: Map<any, any>;
  public paginate: Collection<string, any>;
  public customAdd: Collection<string, any>;
  public cluster: ClusterClient<Client>;
  public cooldownHandler: CooldownHandler;
  public database: DatabaseHandler;
  public translation: TranslationHandler;
  public webhookHandler: WebhookHandler;
  public keepAlive: KeepAlive;
  public dailyMessage: DailyMessage;
  public voting: Voting;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
      ],
      partials: [Partials.Channel],
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
    // Allows for paginating
    this.paginate = new Collection();

    // For accepting or declining of adding text to custom text
    this.customAdd = new Collection();

    // The cooldown handler
    this.cooldownHandler = new CooldownHandler(this);
    this.cooldownHandler.startSweeper();

    // Init the cluster client
    this.cluster = new ClusterClient(this);

    this.cluster.on("ready", async () => {
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

      await this.initialize();
    });
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
    return this.login(process.env.DISCORD_TOKEN);
  }
}
