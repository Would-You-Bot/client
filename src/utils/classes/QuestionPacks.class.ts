import { BasePackDocument, BasePackModel } from '@models/BasePack.model';
import { CustomPackDocument, CustomPackModel } from '@models/CustomPack.model';
import { GuildQuestionType } from '@typings/guild';
import { BaseQuestion, CustomQuestion, BasePack as IBasePack, CustomPack as ICustomPack } from '@typings/pack';
import { logger } from '@utils/client';

/**
 * The base pack class.
 */
class BasePacks {
  private cache = new Map<string, IBasePack>();

  /**
   * Base pack class constructor.
   * @param guildIds The guild IDs.
   */
  public constructor(guildIds: string[]) {
    // Fetch all base packs on initialization.
    this.fetch(guildIds);
  }

  /**
   * Assign base packs to the cache.
   * @param docs The base pack documents.
   */
  private assign(docs: BasePackDocument[]): void {
    docs.forEach((basePack: BasePackDocument) => {
      // Add the pack to the cache map
      this.cache.set(String(basePack.id), basePack.toObject());
    });
  }

  /**
   * Fetch base packs.
   * @param guildIds The guild IDs.
   * @returns The base packs.
   */
  private async fetch(guildIds?: string[]): Promise<Map<string, IBasePack> | undefined> {
    try {
      if (guildIds) {
        // Fetch the base packs from the database.
        const basePacks = await BasePackModel.find({
          guildIds: { $in: guildIds },
        });

        // If there are no base packs, return the cache (empty map).
        if (basePacks.length === 0) return this.cache;

        // Assign the packs to the cache.
        this.assign(basePacks);

        return this.cache;
      } else {
        return this.cache;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Get a random base question.
   * @returns A random base question.
   */
  public async random(): Promise<BaseQuestion | undefined> {
    // Get a random pack.
    const randomPackNum = Math.floor(Math.random() * this.cache.size);
    const randomPackKey = Array.from(this.cache.keys())[randomPackNum];
    const randomPack = this.cache.get(randomPackKey);
    if (!randomPack) return this.random();

    // Get a random question.
    const randomQuestionNum = Math.floor(Math.random() * randomPack.questions.length);
    const randomQuestion = randomPack.questions[randomQuestionNum];

    return randomQuestion;
  }
}

/**
 * The custom pack class.
 */
class CustomPacks {
  private cache: Map<string, ICustomPack> = new Map<string, ICustomPack>();

  /**
   * Custom pack class constructor.
   * @param guildIds The guild IDs.
   */
  public constructor(guildIds: string[]) {
    // Fetch all custom packs on initialization.
    this.fetch(guildIds);
  }

  /**
   * Assign custom packs to the cache.
   * @param docs The custom pack documents.
   */
  private assign(docs: CustomPackDocument[]): void {
    docs.forEach((customPack: CustomPackDocument) => {
      // Add the pack to the cache map
      this.cache.set(String(customPack.id), customPack.toObject());
    });
  }

  /**
   * Fetch custom packs.
   * @param guildIds The guild IDs.
   * @returns The custom packs.
   */
  private async fetch(guildIds: string[]): Promise<Map<string, ICustomPack> | undefined> {
    try {
      // Fetch the custom packs from the database.
      const customPacks = await CustomPackModel.find({
        guildIds: { $in: guildIds },
      });

      // If there are no custom packs, return the cache (empty map).
      if (customPacks.length === 0) return this.cache;

      // Assign the packs to the cache.
      this.assign(customPacks);

      return this.cache;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Create a custom pack.
   * @param pack The custom pack.
   * @returns The custom pack.
   */
  public async create(pack: ICustomPack): Promise<ICustomPack | undefined> {
    try {
      // Create the pack in the database.
      const customPack = await CustomPackModel.create({
        ...pack,
      });

      // If the pack doesn't exist, return undefined.
      this.cache.set(String(customPack.id), customPack.toObject());

      // Return the pack.
      return customPack.toObject();
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Update a custom pack.
   * @param guildId The guild ID.
   * @param pack The new custom pack data.
   * @returns The updated custom pack if successful.
   */
  public async update(guildId: string, pack: ICustomPack): Promise<ICustomPack | undefined> {
    try {
      // Update the pack in the database.
      const customPack = await CustomPackModel.findOneAndUpdate(
        {
          guildId,
          name: pack.name,
        },
        pack,
        { new: true }
      );

      // If the pack doesn't exist, return undefined.
      if (!customPack) return;

      // Update the pack in the cache.
      this.cache.set(String(customPack.id), customPack.toObject());

      return customPack.toObject();
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Delete a custom pack.
   * @param guildId The guild ID.
   * @returns Whether the base pack was deleted successfully.
   */
  public async delete(guildId: string): Promise<boolean> {
    try {
      // Delete the pack from the database.
      const customPack = await CustomPackModel.findOneAndDelete({
        guildId,
      });

      // If the pack doesn't exist, return false.
      if (!customPack) return false;

      // Delete the pack from the cache.
      this.cache.delete(String(customPack.id));

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  /**
   * Get a random custom question.
   * @returns A random custom question.
   */
  public random(): CustomQuestion | undefined {
    // Get a random pack.
    const randomPackNum = Math.floor(Math.random() * this.cache.size);
    const randomPackKey = Array.from(this.cache.keys())[randomPackNum];
    const randomPack = this.cache.get(randomPackKey);
    if (!randomPack) return;

    // Get a random question.
    const randomQuestionNum = Math.floor(Math.random() * randomPack.questions.length);
    const randomQuestion = randomPack.questions[randomQuestionNum];

    // Return the random question.
    return randomQuestion;
  }

  /**
   * Add a question to a custom pack.
   * @param packId The pack ID.
   * @param question The question to add.
   * @returns The added question.
   */
  public async addQuestion(packId: string, question: CustomQuestion): Promise<CustomQuestion | undefined> {
    try {
      // Add the question to the pack in the database.
      const updatedPack = await CustomPackModel.findOneAndUpdate(
        {
          _id: packId,
        },
        {
          $push: {
            questions: {
              ...question,
            },
          },
        },
        { new: true }
      );

      // If the pack doesn't exist, return undefined.
      if (!updatedPack) return;

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return question;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Update a question in a custom pack.
   * @param packId The pack ID.
   * @param questionId The question ID.
   * @param question The question to update.
   * @returns The updated question.
   */
  public async updateQuestion(
    packId: string,
    questionId: string,
    question: CustomQuestion
  ): Promise<CustomQuestion | undefined> {
    try {
      // Update the question in the pack in the database.
      const updatedPack = await CustomPackModel.findOneAndUpdate(
        {
          '_id': packId,
          'questions._id': questionId,
        },
        {
          $set: {
            'questions.$': {
              ...question,
            },
          },
        },
        { new: true }
      );

      // If the pack doesn't exist, return undefined.
      if (!updatedPack) return;

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return question;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Delete a question from a custom pack.
   * @param packId The pack ID.
   * @param questionId The question ID.
   */
  public async deleteQuestion(packId: string, questionId: string): Promise<CustomQuestion | undefined> {
    try {
      // Delete the question from the pack in the database.
      const updatedPack = await CustomPackModel.findOneAndUpdate(
        {
          _id: packId,
        },
        {
          $pull: {
            questions: {
              _id: questionId,
            },
          },
        },
        { new: true }
      );

      // If the pack doesn't exist, return undefined.
      if (!updatedPack) return;

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return;
    } catch (error) {
      logger.error(error);
    }
  }
}

/**
 * The question pack class - parent class for interaction with both base and custom packs.
 */
export default class QuestionPacks {
  private guildIds: string[];
  public base: BasePacks;
  public custom: CustomPacks;

  /**
   * Question packs class constructor.
   * @param guildIds The guild IDs.
   */
  public constructor(guildIds: string[]) {
    this.guildIds = guildIds;
    this.base = new BasePacks(this.guildIds);
    this.custom = new CustomPacks(this.guildIds);
  }

  /**
   * Random method type for base pack questions.
   */
  // public async random(questionType: GuildQuestionType.Base): Promise<BaseQuestion | undefined>;

  /**
   * Random method type for custom pack questions.
   */
  // public async random(questionType: GuildQuestionType.Custom): Promise<CustomQuestion | undefined>;

  /**
   * Random method type for either base or custom pack questions.
   */
  // public async random(questionType: GuildQuestionType.Mixed): Promise<CustomQuestion | BaseQuestion | undefined>;

  /**
   * Get a random question.
   * @param questionType The question type.
   * @returns A random question.
   */
  public async random(questionType: GuildQuestionType): Promise<CustomQuestion | BaseQuestion | undefined> {
    const randomNum: number = Math.round(Math.random());

    if (questionType === GuildQuestionType.Base || (questionType === GuildQuestionType.Mixed && randomNum === 0)) {
      // If the question type is base or the random number is 0, return a random base question.
      return this.base.random();
    } else if (questionType === GuildQuestionType.Custom || randomNum === 1) {
      // If the question type is custom or the random number is 1, return a random custom question.
      return this.custom.random();
    }
  }
}
