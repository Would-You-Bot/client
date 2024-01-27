import { get } from "mongoose";
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

    this.client = redisClient;
    return this.client;
  }

  /**
   * Fetch a guild from the database (Not suggested use .get()!)
   * @param {string|number} serverId the server id
   * @param {string} questionId the server id
   * @returns {this.guildModel}
   * @private
   */
  async addQuestionCache(
    serverId: string|number,
    questionId: string,
  ) {

    const result = this.getQuestionCache(serverId);

    const oldResult = result ?  JSON.parse(await result) : {};

    const newResult = oldResult.push(questionId);

    await this.client.set(serverId, JSON.stringify(newResult));

    return null;
  }

  async getQuestionCache(
    serverId: string|number,
  ) {
    const result: string = await this.client.get(serverId);
    return JSON.parse(result);
  }
}
