const { connect } = require("mongoose").set("strictQuery", true);
const { ChalkAdvanced } = require("chalk-advanced");
const Sentry = require("@sentry/node");

module.exports = class DatabaseHandler {
  /**
   * Create a database handler
   * @param {string} connectionString the connection string
   */
  constructor(connectionString) {
    this.cache = new Map();
    this.userCache = new Map();
    this.guildModel = require("./Models/guildModel");
    this.userModel = require("./Models/userModel");
    this.connectionString = connectionString;
  }

  /**
   * This is the cache sweeper to keep the cache clean!
   * @param client the client object
   */
  startSweeper(client) {
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
    await connect(this.connectionString, {
      useNewUrlParser: true,
    })
      .catch((err) => {
        Sentry.captureException(err);
      })
      .then(() =>
        console.log(
          `${ChalkAdvanced.white("Database")} ${ChalkAdvanced.gray(
            ">",
          )} ${ChalkAdvanced.green("Successfully loaded database")}`,
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
  async fetchGuild(guildId, createIfNotFound = false) {
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
  async getGuild(guildId, createIfNotFound = true, force = false) {
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
  async deleteGuild(guildId, onlyCache = false) {
    if (this.cache.has(guildId)) this.cache.delete(guildId);

    return !onlyCache ? this.guildModel.deleteMany({ guildID: guildId }) : true;
  }

  /**
   * Update the settings from a guild
   * @param {number|string} guildId the server id
   * @param {object | this.guildModel} data the updated or new data
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {Promise<this.guildModel|null>}
   */
  async updateGuild(guildId, data = {}, createIfNotFound = false) {
    let oldData = await this.getGuild(guildId, createIfNotFound);

    if (oldData) {
      if (oldData?._doc) oldData = oldData?._doc;

      data = { ...oldData, ...data };

      this.cache.set(guildId, data);

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
   * Fetch a user from the database (Not suggested use .get()!)
   * @param {number|string} userId the user id
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {this.userModel}
   * @private
   */
  async fetchUser(userId, createIfNotFound = false) {
    const fetched = await this.userModel.findOne({ userID: userId });

    if (fetched) return fetched;
    if (!fetched && createIfNotFound) {
      await this.userModel.create({
        userID: userId,
      });

      return this.userModel.findOne({ userID: userId });
    }
    return null;
  }

  /**
   * Get a user database from the cache
   * @param {string} userId the server id
   * @param {boolean} createIfNotFound create a database entry if not found
   * @param {boolean} force if it should force fetch the user
   * @returns {this.guildModel}
   */
  async getUser(userId, createIfNotFound = true, force = false) {
    if (force) return this.fetchUser(userId, createIfNotFound);

    if (this.userCache.has(userId)) {
      return this.userCache.get(userId);
    }

    const fetched = await this.fetchUser(userId, createIfNotFound);
    if (fetched) {
      this.userCache.set(userId, fetched?.toObject() ?? fetched);

      return this.userCache.get(userId);
    }
    return null;
  }

  /**
   * Delete a guild from the db and the cache
   * @param {number|string} guildId the server id
   * @param {boolean} onlyCache if you want to only delete the cache
   * @returns {Promise<deleteMany|boolean>}
   */
  async deleteUser(userId, onlyCache = false) {
    if (this.userCache.has(userId)) this.userCache.delete(userId);

    return !onlyCache ? this.userModel.deleteMany({ userID: userId }) : true;
  }

  /**
   * Update the settings from a guild
   * @param {number|string} guildId the server id
   * @param {object | this.guildModel} data the updated or new data
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {Promise<this.guildModel|null>}
   */
  async updateUser(userId, data = {}, createIfNotFound = false) {
    let oldData = await this.getUser(userId, createIfNotFound);

    if (oldData) {
      if (oldData?._doc) oldData = oldData?._doc;

      data = { ...oldData, ...data };

      this.userCache.set(userId, data);

      return this.userModel.updateOne(
        {
          userID: userId,
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
};
