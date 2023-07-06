import { BasePackDocument, BasePackModel } from '@models/BasePack';
import { CustomPackDocument, CustomPackModel } from '@models/CustomPack';
import { logger } from '@utils/client';
import {
  BaseQuestion,
  CustomQuestion,
  GuildPackType,
  BasePack as IBasePack,
  CustomPack as ICustomPack,
  PackQuestionType,
} from '@would-you/types';

/**
 * The base pack class.
 */
class BasePacks {
  private cache = new Map<string, IBasePack>();

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
  public async fetch(guildIds?: string[]): Promise<Map<string, IBasePack>> {
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
      throw new Error(String(error));
    }
  }

  /**
   * Get a random base pack.
   * @param questionType The question type.
   * @returns A random base pack.
   * @throws If no base packs are found.
   */
  private getRandomPack(questionType?: PackQuestionType): IBasePack {
    // Filter the packs by question type, if provided.
    const packs = questionType
      ? Array.from(this.cache.values()).filter((pack) =>
          pack.questions.some(
            (question) => question.questionType === questionType
          )
        )
      : Array.from(this.cache.values());

    if (packs.length === 0)
      throw new Error(
        `No base packs found${
          questionType ? ` with questions of type: "${questionType}"` : ''
        }.`
      );

    // Get a random pack from the filtered packs.
    const randomPackIndex = Math.floor(Math.random() * this.cache.size);
    const randomPack = packs[randomPackIndex];
    randomPack.questions.filter(
      (question) => question.questionType === questionType
    );
    return randomPack;
  }

  /**
   * Get a random base question.
   * @param questionType The question type.
   * @returns A random base question.
   * @throws If no base packs are found.
   */
  public random(questionType?: PackQuestionType): BaseQuestion {
    const randomPack = this.getRandomPack(questionType);

    // Get a random question.
    const randomQuestionNum = Math.floor(
      Math.random() * randomPack.questions.length
    );
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
  public async fetchAll(guildIds: string[]): Promise<Map<string, ICustomPack>> {
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
      throw new Error(String(error));
    }
  }

  /**
   * Create a custom pack.
   * @param pack The custom pack.
   * @returns The custom pack.
   */
  public async create(pack: ICustomPack): Promise<ICustomPack> {
    try {
      // Create the pack in the database.
      const customPack = await CustomPackModel.create({
        ...pack,
      });

      // Set the pack in the cache.
      this.cache.set(String(customPack.id), customPack.toObject());

      // Return the pack.
      return customPack.toObject();
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
    }
  }

  /**
   * Update a custom pack.
   * @param guildId The guild ID.
   * @param pack The new custom pack data.
   * @returns The updated custom pack if successful.
   */
  public async update(
    guildId: string,
    pack: ICustomPack
  ): Promise<ICustomPack> {
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

      // If the pack doesn't exist, throw an error.
      if (!customPack)
        throw new Error(`Custom pack not found: ${guildId} - ${pack.name}`);

      // Update the pack in the cache.
      this.cache.set(String(customPack.id), customPack.toObject());

      return customPack.toObject();
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
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
   * Get a random custom pack.
   * @param questionType The question type.
   * @returns A random custom pack.
   * @throws If no custom packs are found.
   */
  private getRandomPack(questionType?: PackQuestionType): ICustomPack {
    // Filter the packs by question type, if provided.
    const packs = questionType
      ? Array.from(this.cache.values()).filter((pack) =>
          pack.questions.some(
            (question) => question.questionType === questionType
          )
        )
      : Array.from(this.cache.values());

    if (packs.length === 0)
      throw new Error(
        `No custom packs found${
          questionType ? ` with questions of type: "${questionType}"` : ''
        }.`
      );

    // Get a random pack from the filtered packs.
    const randomPackIndex = Math.floor(Math.random() * this.cache.size);
    const randomPack = packs[randomPackIndex];
    randomPack.questions.filter(
      (question) => question.questionType === questionType
    );
    return randomPack;
  }

  /**
   * Get a random custom question.
   * @param questionType The question type.
   * @returns A random custom question.
   * @throws If no custom packs are found.
   */
  public random(questionType?: PackQuestionType): CustomQuestion {
    const randomPack = this.getRandomPack(questionType);

    // Get a random question.
    const randomQuestionNum = Math.floor(
      Math.random() * randomPack.questions.length
    );
    const randomQuestion = randomPack.questions[randomQuestionNum];

    return randomQuestion;
  }

  /**
   * Add a question to a custom pack.
   * @param packId The pack ID.
   * @param question The question to add.
   * @returns The added question.
   */
  public async addQuestion(
    packId: string,
    question: CustomQuestion
  ): Promise<CustomQuestion> {
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

      // If the pack doesn't exist, return throw an error.
      if (!updatedPack) throw new Error(`Custom pack not found: ${packId}`);

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return question;
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
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
  ): Promise<CustomQuestion> {
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

      // If the pack doesn't exist, throw an error.
      if (!updatedPack) throw new Error(`Custom pack not found: ${packId}`);

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return question;
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
    }
  }

  /**
   * Delete a question from a custom pack.
   * @param packId The pack ID.
   * @param questionId The question ID.
   * @returns Whether the question was deleted successfully.
   */
  public async deleteQuestion(
    packId: string,
    questionId: string
  ): Promise<boolean> {
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

      // If the pack doesn't exist, return false.
      if (!updatedPack) return false;

      // Update the pack in the cache.
      this.cache.set(String(updatedPack.id), updatedPack.toObject());

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  /**
   * Get all custom packs for a guild from the database and cache.
   * @param userId The guild ID.
   * @returns The custom packs.
   */
  public async deleteAll(userId: string): Promise<number> {
    try {
      // Delete all packs from the database.
      const deletedCustomPacks = await CustomPackModel.deleteMany({
        guildId: userId,
      });

      // Delete all packs from the cache.
      for (const [key, customPack] of this.cache.entries()) {
        if (customPack.userId === userId) this.cache.delete(key);
      }

      // Return the number of deleted packs.
      return deletedCustomPacks.deletedCount;
    } catch (error) {
      logger.error(error);
      throw new Error(String(error));
    }
  }
}

/**
 * The question pack class - parent class for interaction with both base and custom packs.
 */
export default class QuestionPacks {
  public base: BasePacks;
  public custom: CustomPacks;

  /**
   * Question packs class constructor.
   */
  public constructor() {
    this.base = new BasePacks();
    this.custom = new CustomPacks();
  }

  /**
   * Get a random question.
   * @param packType The question type.
   * @param questionType The question type.
   * @returns A random question.
   */
  public random(
    packType: GuildPackType,
    questionType?: PackQuestionType
  ): CustomQuestion | BaseQuestion {
    const randomNum: number = Math.round(Math.random());
    try {
      if (
        packType === GuildPackType.Base ||
        (packType === GuildPackType.Mixed && randomNum === 0)
      ) {
        // If the question type is base or the random number is 0, return a random base question.
        return this.base.random(questionType);
      } else if (packType === GuildPackType.Custom || randomNum === 1) {
        // If the question type is custom or the random number is 1, return a random custom question.
        return this.custom.random(questionType);
      }

      // If the question type is not recognized, throw an error.
      throw new Error(`Question type not recognized: ${packType}`);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Sync the question packs.
   * @param guildIds The guild IDs.
   */
  public async sync(guildIds: string[]): Promise<void> {
    await Promise.all([
      await this.base.fetch(guildIds),
      await this.custom.fetchAll(guildIds),
    ]);
  }
}
