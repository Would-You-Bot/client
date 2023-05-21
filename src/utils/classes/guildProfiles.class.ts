import config from '@config';
import { GuildProfileDocument, GuildProfileModel, GuildProfileSchema } from '@models/GuildProfile.model';
import { CoreLanguage } from '@typings/core';
import {
  GuildDaily,
  GuildPremium,
  GuildQuestionType,
  GuildWelcome,
  GuildProfile as IGuildProfile,
} from '@typings/guild';
import { logger } from '@utils/client';

/**
 * The guild profile class.
 */
class GuildProfile implements IGuildProfile {
  public guildId: string;
  public timezone: string;
  public language: CoreLanguage;
  public questionType: GuildQuestionType;
  public premium: GuildPremium;
  public welcome: GuildWelcome;
  public daily: GuildDaily;
  public botJoined: number;
  public debug?: boolean;

  /**
   * Create a new guild profile instance.
   * @param doc The guild profile document.
   */
  public constructor(doc: GuildProfileDocument) {
    this.assign(doc);
  }

  /**
   * Assign the guild profile document to the class.
   * @param doc The guild profile document.
   */
  private assign(doc: GuildProfileDocument): void {
    this.guildId = doc.guildId;
    this.language = doc.language;
    this.premium = doc.premium;
    this.welcome = doc.welcome;
    this.daily = doc.daily;
    this.botJoined = doc.botJoined;
    this.debug = doc.debug;
  }

  /**
   * Fetch a guild profile.
   * @returns The guild profile document.
   */
  public async fetch(): Promise<GuildProfile | undefined> {
    try {
      // Fetch the guild profile from the database
      const guildProfileDoc = await GuildProfileModel.findOne({ guildId: this.guildId });

      // If the guild profile does not exist return undefined
      if (!guildProfileDoc) return;

      // Assign the guild profile document to the class
      this.assign(guildProfileDoc);
      return this;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Update the settings from a guild.
   * @param newGuildProfile The data values to update.
   */
  public async updateGuild(newGuildProfile: GuildProfileSchema): Promise<GuildProfile | undefined> {
    try {
      // Update the guild profile in the database
      const updatedGuildProfileDoc = await GuildProfileModel.findOneAndUpdate(
        {
          guildId: this.guildId,
        },
        {
          $set: newGuildProfile,
        },
        {
          new: true,
        }
      );

      // If the guild profile was not updated return undefined
      if (!updatedGuildProfileDoc) return;

      // Assign the updated guild profile document to the class
      this.assign(updatedGuildProfileDoc);
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Delete a guild profile from the database.
   * @returns The deleted guild profile document.
   */
  public async delete(): Promise<boolean> {
    try {
      // Delete the guild profile from the database
      const deletedGuildProfile = await GuildProfileModel.findOneAndDelete({ guildId: this.guildId });

      // If the guild profile was not deleted return false
      if (!deletedGuildProfile) return false;

      // Return the deleted guild profile
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  /**
   * Check if the guild has the debugMode value or user is a developer.
   * @param userId The user id.
   * @returns True if debug is approved otherwise false.
   */
  public debugEnabled(userId: string): boolean {
    const debugApproved = this.debug ?? config.developers.includes(userId);
    return debugApproved;
  }
}

/**
 * The guild profiles class.
 */
export default class GuildProfiles {
  public cache = new Map<string, GuildProfile>();
  private guildIds: string[];

  /**
   * Create a new guild profile instance.
   * @param guildIds The guild ids.
   */
  public constructor(guildIds: string[]) {
    this.guildIds = guildIds;
    this.fetch();
  }

  /**
   * First type for the fetch method without guild id and returns array of guild profiles.
   */
  public async fetch(): Promise<GuildProfile[] | undefined>;

  /**
   * Second type for the fetch method with guild id and returns a single guild profile.
   * @param guildId The guild id.
   */
  public async fetch(guildId: string): Promise<GuildProfile | undefined>;

  /**
   * Fetch a guild profile if the id is provided or all guild profiles if an id is not provided.
   * @param guildId The guild id if fetching a single guild profile.
   * @returns The guild profile document or all guild profile if successsful.
   */
  public async fetch(guildId?: string): Promise<GuildProfile | GuildProfile[] | undefined> {
    if (guildId) {
      // If an id is provided fetch a single guild profile
      if (this.cache.has(guildId)) return this.cache.get(guildId);

      try {
        // Fetch the guild profile document
        const guildProfileDoc = await GuildProfileModel.findById(guildId);

        // If the guild profile does not exist create a new one
        if (!guildProfileDoc) {
          const createdGuildProfile = await this.create({
            guildId,
            timezone: 'America/New_York',
            language: CoreLanguage.English,
            questionType: GuildQuestionType.Base,
            premium: {
              enabled: false,
            },
            welcome: {
              enabled: false,
            },
            daily: {
              enabled: false,
              time: '12:00',
              thread: false,
            },
            botJoined: Date.now(),
            debug: false,
          });

          return createdGuildProfile;
        }

        // Create a new guild profile instance
        const guildProfile = new GuildProfile(guildProfileDoc);

        // Add the guild profile to the cache
        this.cache.set(guildId, guildProfile);

        return guildProfile;
      } catch (error) {
        logger.error(error);
      }
    } else {
      // If an id is not provided fetch all guild profiles
      try {
        const guildProfileDocs = await GuildProfileModel.find({ guildId: { $in: this.guildIds } });
        if (guildProfileDocs.length === 0) return;

        // Loop through all guild profile documents and create a new guild profile instance for each one
        const guildProfiles: GuildProfile[] = guildProfileDocs.map((guildProfileDoc) => {
          const guildProfile = new GuildProfile(guildProfileDoc);
          this.cache.set(guildProfile.guildId, guildProfile);
          return guildProfile;
        });

        return guildProfiles;
      } catch (error) {
        logger.error(error);
      }
    }
  }

  /**
   * Create a new guild profile.
   * @param guildProfileData The guild profile data.
   * @returns The guild profile if successsful.
   */
  public async create(guildProfileData: GuildProfileSchema): Promise<GuildProfile | undefined> {
    try {
      // Create a new guild profile document
      const guildProfileDoc = await GuildProfileModel.create(guildProfileData);

      // Create a new guild profile instance
      const guildProfile = new GuildProfile(guildProfileDoc);

      // Add the guild profile to the cache
      this.cache.set(guildProfile.guildId, guildProfile);

      return guildProfile;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Delete a guild profile.
   * @param id The id of the guild profile to delete.
   * @returns The deleted guild profile.
   */
  public async delete(id: string): Promise<boolean> {
    try {
      // If the guild profile is not in the cache return false
      if (!this.cache.has(id)) return false;

      // Delete the guild profile from the cache
      this.cache.delete(id);

      // Delete the guild profile from the database
      const deletedGuildProfile = await this.cache.get(id)?.delete();

      // If the guild profile was not deleted return false
      if (!deletedGuildProfile) return false;

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  /**
   * Sync the guild profiles to local cache.
   */
  public async sync(): Promise<void> {
    try {
      await this.fetch();
    } catch (error) {
      logger.error(error);
    }
  }
}
