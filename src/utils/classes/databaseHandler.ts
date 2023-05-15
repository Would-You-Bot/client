import colors from 'colors';
import mongoose from 'mongoose';

import guildProfileModel, {
  GuildProfileDocument,
} from '@models/guildProfile.model';
import { logger } from '@utils/client';
import { ExtendedClient } from 'src/client';

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
    this.guildProfileModel = guildProfileModel;
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
      logger.info(
        `${colors.white('Database')} ${colors.gray('>')} ${colors.green(
          'Successfully loaded database'
        )}`
      );
      return connection;
    } catch (error) {
      logger.error(error);
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
    createIfNotFound: boolean | undefined
  ): Promise<GuildProfileDocument | null> {
    const fetched = await this.guildProfileModel.findOne({ guildID: guildId });

    if (fetched) return fetched;
    if (!fetched && createIfNotFound) {
      await this.guildProfileModel.create({
        guildID: guildId,
        language: 'en_EN',
        botJoined: Date.now() / 1000 || 0,
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
    createIfNotFound = true,
    force = false
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
  async deleteGuild(guildId: string, onlyCache = false) {
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
    createIfNotFound = false
  ) {
    const oldData = await this.getGuild(guildId, createIfNotFound);
    if (!oldData) return null;

    const newData: { [key: string]: any } = { ...oldData };

    // Loop through all the data values and assign it to the new data object
    for (const key in dataValues) {
      if (!newData[key]) {
        newData[key] = dataValues[key];
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
