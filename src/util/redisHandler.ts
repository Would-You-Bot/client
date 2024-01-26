import { createClient } from "redis";

export default class RedisHandler {
  private connectionToken: string;
  private connectionHost: string;
  private client: any;

  /**
   * Create a database handler
   * @param {string} connectionString the connection string
   */
  constructor(connectionToken: string, connectionHost: string) {
    this.connectionToken = connectionToken;
    this.connectionHost = connectionHost;
  }

  /**
   * Connect to the mongoose database
   * @returns {Promise<void>}
   */
  async connectToRedis(): Promise<void> {
    const redisClient = createClient({
      password: this.connectionToken,
      socket: {
        host: this.connectionHost,
        port: 12454,
      },
    });

    await redisClient.hSet("user-session:123", {
      name: "John",
      surname: "Smith",
      company: "Redis",
      age: 29,
    });

    this.client = redisClient;
    return this.client;
  }

  /**
   * Fetch a guild from the database (Not suggested use .get()!)
   * @param {number|string} guildId the server id
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {this.guildModel}
   * @private
   */
  async fetchGuild(
    guildId: number | string,
    createIfNotFound: boolean = false,
  ) {
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
  async getGuild(
    guildId: string,
    createIfNotFound: boolean = true,
    force: boolean = false,
  ): Promise<IGuildModel | null> {
    if (force) return this.fetchGuild(guildId, createIfNotFound);

    if (this.cache.has(guildId)) {
      return this.cache.get(guildId) || null;
    }

    const fetched = await this.fetchGuild(guildId, createIfNotFound);
    if (fetched) {
      this.cache.set(guildId, fetched?.toObject() ?? fetched);

      return this.cache.get(guildId) || null;
    }
    return null;
  }

  /**
   * Delete a guild from the db and the cache
   * @param {number|string} guildId the server id
   * @param {boolean} onlyCache if you want to only delete the cache
   * @returns {Promise<deleteMany|boolean>}
   */
  async deleteGuild(guildId: number | string, onlyCache: boolean = false) {
    if (this.cache.has(guildId.toString()))
      this.cache.delete(guildId.toString());

    return !onlyCache ? this.guildModel.deleteMany({ guildID: guildId }) : true;
  }

  /**
   * Update the settings from a guild
   * @param {string} guildId the server id
   * @param {object | this.guildModel} data the updated or new data
   * @param {boolean} createIfNotFound create a database entry if not found
   * @returns {Promise<this.guildModel|null>}
   */
  async updateGuild(
    guildId: string,
    data: object | IGuildModel,
    createIfNotFound: boolean = false,
  ) {
    let oldData = await this.getGuild(guildId.toString(), createIfNotFound);

    if (oldData) {
      data = { ...oldData, ...data };

      this.cache.set(guildId.toString(), data as IGuildModel);

      return this.guildModel.updateOne(
        {
          guildID: guildId,
        },
        data,
      );
    }
    return null;
  }
}
