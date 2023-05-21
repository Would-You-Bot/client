import { BasePackDocument, BasePackModel } from '@models/BasePack.model';
import { CustomPackModel } from '@models/CustomPack.model';
import { BasePack as IBasePack, CustomPack as ICustomPack } from '@typings/pack';
import { logger } from '@utils/client';

/**
 * The base pack class.
 */
class BasePacks {
  public cache = new Map<string, IBasePack>();

  /**
   * Base pack class constructor.
   * @param docs The base pack documents.
   */
  public constructor(docs: BasePackDocument[]) {
    this.assign(docs);
  }

  private assign(docs: BasePackDocument[]) {
    basePacks.forEach((basePack: BasePackDocument) => {
      this.cache.set(basePack._id, basePack.toObject());
    });
  }

  /**
   * Fetch base packs.
   * @param guildIds The guild IDs.
   * @returns The base packs.
   */
  public async fetch(guildIds?: string[]) {
    if (guildIds) {
      const basePacks = await BasePackModel.find({
        guildIds: { $in: guildIds },
      });

      if (basePacks.length === 0) return this.cache;

      return this.cache;
    } else {
      return this.cache;
    }
  }

  public async random() {}
}

/**
 * The custom pack class.
 */
class CustomPacks {}

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
    this.base = new BasePacks();
    this.custom = new CustomPacks();
  }
}
