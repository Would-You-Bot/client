interface Language {
  [key: string]: object;
}

export default class TranslationHandler {
  availableLanguages: string[];
  translations: { [key: string]: Language };

  /**
   * Get a translation from the language file
   * @param the language keys
   */
  constructor(/* languages: string[] | null */) {
    // this.availableLanguages = languages ?? ['de_DE', 'en_EN', 'es_ES'];
    this.availableLanguages = ['de_DE', 'en_EN', 'es_ES'];
    this.translations = {};

    // Initialize default languages
    for (const l of this.availableLanguages) {
      const data = require(`../languages/${l}.json`);
      this.initLanguage(l, data);
    }

    // Initialize what would you do
    for (const l of this.availableLanguages) {
      const data = require(`../data/wwyd-${l}.json`);
      this.initLanguage(l + '_wwyd', data);
    }

    // Initialize rather
    for (const l of this.availableLanguages) {
      const data = require(`../data/rather-${l}.json`);
      this.initLanguage(l + '_rather', data);
    }

    // Initialize never have I ever
    for (const l of this.availableLanguages) {
      const data = require(`../data/nhie-${l}.json`);
      this.initLanguage(l + '_nhie', data);
    }
  }

  /**
   * Init a language and add it to the translations
   * @param key the language key
   * @param language the language object
   */
  private initLanguage(key: string, language: Language) {
    this.translations[key] = language;
  }

  /**
   * Check if a key is a valid translation key
   * @param value the value to check
   * @returns if the value is a valid translation key
   */
  private checkRegex(value: string) {
    return /^[a-z]{2}_[A-Z]{2}(?:_rather|_wwyd|_nhie)?$/.test(value);
  }

  /**
   * Get the language data
   * @param language the language key
   * @returns the language data
   */
  private getLanguage(language: string) {
    if (!this.checkRegex(language)) return this.translations['en_EN'];
    return this.translations[language];
  }

  /**
   * Add an available language to the languages array
   * @param language the language key
   */
  addLanguage(language: string) {
    if (!this.checkRegex(language))
      throw new Error('Invalid language format. Example: en_EN');

    this.availableLanguages.push(language);
  }

  /**
   * Reload the translation handler
   */
  reload() {
    this.translations = {};
    for (const l of this.availableLanguages) {
      try {
        const d = require(`../languages/${l}.json`);
        if (!d) continue;
        this.initLanguage(l, d);
      } catch (e) {}
    }
  }

  /**
   * Get a translation from the language file
   * @param language the language key
   * @param path the path to the translation
   * @param data the data to replace in the translation
   * @returns the translation which could be string or null
   * @example const translation = getTranslation('en_EN', 'commands.ping.pong', {ping: 100});
   */
  get(
    language: string,
    path: string,
    data: Record<string, string> = {}
  ): string {
    if (!language) language = 'en_EN';

    const l = this.getLanguage(language);
    const p = path.split('.');
    let c: null | Record<string, string> | object | string = null;

    if (p.length > 0) {
      for (const i of p) {
        try {
          if (!c) {
            if (!l.hasOwnProperty(i)) break;
            c = l[i];
          } else {
            if (!(c as Record<string, string>).hasOwnProperty(i)) break;
            c = (c as Record<string, string>)[i];
          }
        } catch (err) {
          break;
        }
      }
    } else {
      return path;
    }

    if (!c) return path;

    if (data && typeof c === 'string') {
      return c.replace(
        /{(\w+)}/g,
        (match: string, key: string) => data[key] ?? match
      );
    }

    return c.toString();
  }
}
