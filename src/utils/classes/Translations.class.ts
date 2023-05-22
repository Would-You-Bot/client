import { Translations as ITranslations } from '@typings/translations';

import de from '@constants/languages/de';
import en from '@constants/languages/en';
import es from '@constants/languages/es';

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
