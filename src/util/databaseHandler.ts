import { Model, connect, set } from "mongoose";
import { white, gray, green } from "chalk-advanced";
import Sentry from "@sentry/node";
import { GuildModel, IGuildModel } from "./Models/guildModel";
import WouldYou from "./wouldYou";

export default class DatabaseHandler {
  private cache: Map<string, any>;
  private guildModel: Model<IGuildModel>;
  private connectionString: string;
  /**
   * Create a database handler
   * @param {string} connectionString the connection string
   */
  constructor(connectionString: string) {
    this.cache = new Map();
    this.guildModel = GuildModel;
    this.connectionString = connectionString;
  }

  /**
   * This is the cache sweeper to keep the cache clean!
   * @param client the client object
   */
  startSweeper(client: WouldYou) {
    setInterval(
      () => {
        const guilds = this.cache.values();
        for (const g of guilds) {
          if (!client?.guilds?.cache?.has(g?.guildID)) {
            this.cache.delete(g?.guildID);
          }
        }
      },
      60 * 60 * 1000,
    );
  }

  /**
   * Connect to the mongoose database
   * @returns {Promise<void>}
   */
  async connectToDatabase() {
    set("strictQuery", true);
    await connect(this.connectionString)
      .catch((err) => {
        Sentry.captureException(err);
      })
      .then(() =>
        console.log(
          `${white("Database")} ${gray(">")} ${green(
            "Successfully loaded database",
          )}`,
        ),
      );
  }

  /**
   * Fetch a guild from the database (Not suggested use .get()!)
   * @param {number|string} guildId the server id
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {this.guildModel}
   * @private
   */
  async fetchGuild(guildId: number | string, createIfNotFound = false) {
    const fetched = await this.guildModel.findOne({ guildID: guildId });

    if (fetched) return fetched;
    if (!fetched && createIfNotFound) {
      await this.guildModel.create({
        guildID: guildId,
        language: "en_EN",
        botJoined: (Date.now() / 1000) | 0,
      });

      return this.guildModel.findOne({ guildID: guildId });
    }
    return null;
  }

  /**
   * Get a guild database from the cache
   * @param {string} guildId the server id
   * @param {boolean} createIfNotFound create a database entry if not found
   * @param {boolean} force if it should force fetch the guild
   * @returns {this.guildModel}
   */
  async getGuild(guildId: string, createIfNotFound = true, force = false): Promise<IGuildModel | null> {
    if (force) return this.fetchGuild(guildId, createIfNotFound);

    if (this.cache.has(guildId)) {
      return this.cache.get(guildId);
    }

    const fetched = await this.fetchGuild(guildId, createIfNotFound);
    if (fetched) {
      this.cache.set(guildId, fetched?.toObject() ?? fetched);

      return this.cache.get(guildId);
    }
    return null;
  }

  /**
   * Delete a guild from the db and the cache
   * @param {number|string} guildId the server id
   * @param {boolean} onlyCache if you want to only delete the cache
   * @returns {Promise<deleteMany|boolean>}
   */
  async deleteGuild(guildId: number | string, onlyCache = false) {
    if (this.cache.has(guildId.toString()))
      this.cache.delete(guildId.toString());

    return !onlyCache ? this.guildModel.deleteMany({ guildID: guildId }) : true;
  }

  /**
   * Update the settings from a guild
   * @param {number|string} guildId the server id
   * @param {object | this.guildModel} data the updated or new data
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {Promise<this.guildModel|null>}
   */
  async updateGuild(
    guildId: number | string,
    data = {},
    createIfNotFound = false,
  ) {
    let oldData = await this.getGuild(guildId.toString(), createIfNotFound);

    if (oldData) {
      data = { ...oldData, ...data };

      this.cache.set(guildId.toString(), data);

      return this.guildModel.updateOne(
        {
          guildID: guildId,
        },
        data,
      );
    }
    return null;
  }

  /**
   * Fetch all available settings
   * @returns {Promise<this.guildModal[]>}
   */
  async getAll() {
    return this.guildModel.find();
  }
}
