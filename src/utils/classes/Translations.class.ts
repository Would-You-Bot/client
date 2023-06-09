import { Translations as ITranslations } from '@typings/translations';

import en from '@constants/languages/english';
import de from '@constants/languages/german';
import es from '@constants/languages/spanish';

/**
 * The translations class.
 */
export default class Translations {
  public de: ITranslations;
  public en: ITranslations;
  public es: ITranslations;

  /**
   * Translations constructor.
   */
  public constructor() {
    this.de = de;
    this.en = en;
    this.es = es;
  }
}
