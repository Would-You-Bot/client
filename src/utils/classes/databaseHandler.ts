import colors from 'colors';
import mongoose from 'mongoose';

import guildProfileModel, {
  GuildProfileDocument,
} from '@models/guildProfile.model';
import { ExtendedClient } from 'src/client';
import { logger } from '..';

mongoose.set('strictQuery', true);

export default class DatabaseHandler {
  cache: Map<string, GuildProfileDocument>;
  guildProfileModel = guildProfileModel;
  connectionString: string;

  /**
   * Create a database handler
   * @param connectionString the connection string
   */
  constructor(connectionString: string) {
    this.cache = new Map();
    this.guildProfileModel = require('./Models/guildModel');
    this.connectionString = connectionString;
  }

  /**
   * This is the cache sweeper to keep the cache clean!
   * @param client the client object
   */
  startSweeper(client: ExtendedClient) {
    setInterval(() => {
      const guilds = this.cache.values();
      for (const g of guilds) {
        if (!client?.guilds?.cache?.has(g?.guildID)) {
          this.cache.delete(g?.guildID);
        }
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Connect to the mongoose database
   * @returns The connection
   */
  async connectToDatabase() {
    try {
      const connection = await mongoose.connect(this.connectionString);
      console.log(
        `${colors.white('Database')} ${colors.gray('>')} ${colors.green(
          'Successfully loaded database'
        )}`
      );
      return connection;
    } catch (error) {
      logger;
    }
  }

  /**
   * Fetch a guild from the database (Not suggested use .get()!)
   * @param guildId the server id
   * @param createIfNotFound create a database entry if not found
   * @returns The guild object from the database
   */
  private async fetchGuild(
    guildId: string,
    createIfNotFound: boolean = false
  ): Promise<GuildProfileDocument | null> {
    const fetched = await this.guildProfileModel.findOne({ guildID: guildId });

    if (fetched) return fetched;
    if (!fetched && createIfNotFound) {
      await this.guildProfileModel.create({
        guildID: guildId,
        language: 'en_EN',
        botJoined: (Date.now() / 1000) | 0,
      });

      return this.guildProfileModel.findOne({ guildID: guildId });
    }
    return null;
  }

  /**
   * Get a guild database from the cache
   * @param guildId the server id
   * @param createIfNotFound create a database entry if not found
   * @param force if it should force fetch the guild
   * @returns The guild object from the cache
   */
  async getGuild(
    guildId: string,
    createIfNotFound: boolean = true,
    force: boolean = false
  ): Promise<GuildProfileDocument | null> {
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
   * @param guildId the server id
   * @param onlyCache if you want to only delete the cache
   * @returns if onlyCache is true it will return true
   */
  async deleteGuild(guildId: string, onlyCache: boolean = false) {
    if (this.cache.has(guildId)) this.cache.delete(guildId);

    return !onlyCache
      ? this.guildProfileModel.deleteMany({ guildID: guildId })
      : true;
  }

  /**
   * Update the settings from a guild
   * @param guildId the server id
   * @param data the updated or new data
   * @param createIfNotFound create a database entry if not found
   * @returns The guild object from the database
   */
  async updateGuild(
    guildId: string,
    dataValues: any,
    createIfNotFound: boolean = false
  ) {
    let oldData = await this.getGuild(guildId, createIfNotFound);
    if (!oldData) return null;

    let newData: { [key: string]: any } = { ...oldData };
    for (const key in dataValues) {
      if (!newData[key]) {
        newData[key] = newData[key];
      }
    }

    this.cache.set(guildId, newData as GuildProfileDocument);

    return this.guildProfileModel.updateOne(
      {
        guildID: guildId,
      },
      newData
    );
  }

  /**
   * Fetch all available settings
   * @returns All guilds from the database
   */
  async getAll() {
    return this.guildProfileModel.find();
  }
}
