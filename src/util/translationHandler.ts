import { captureException } from "@sentry/node";

export default class TranslationHandler {
  readonly availableLanguages: string[];
  private translations: any;
  /**
   * Get a translation from the language file
   * @param {string[]} [languages] the language keys
   */
  constructor(languages?: string[]) {
    /**
     * The available languages
     * @type {string[]}
     */
    this.availableLanguages = languages ?? [
      "de_DE",
      "en_EN",
      "es_ES",
      "fr_FR",
      "it_IT",
    ];

    /**
     * The translations
     * @type {object} translations the translations
     * @private
     */
    this.translations = {};

    // Init default languages
    for (const language of this.availableLanguages) {
      const data = require(`../languages/${language}.json`);
      this.initLanguage(language, data);
    }

    // Init what would you do
    for (const language of this.availableLanguages) {
      const data = require(`../data/wwyd-${language}.json`);
      this.initLanguage(language + "_wwyd", data);
    }

    // Inti rather
    for (const language of this.availableLanguages) {
      const data = require(`../data/rather-${language}.json`);
      this.initLanguage(language + "_rather", data);
    }

    // Init never have I ever
    for (const language of this.availableLanguages) {
      const data = require(`../data/nhie-${language}.json`);
      this.initLanguage(language + "_nhie", data);
    }
  }

  /**
   * Init a language and add it to the translations
   * @param {string} key the language key
   * @param {object} language the language object
   * @return {void}
   * @private
   */
  initLanguage(key: string, language: object): void {
    this.translations[key] = language;
  }

  /**
   * Check if a key is a valid translation key
   * @param {string} value the value to check
   * @return {boolean} if the value is a valid translation key
   * @private
   */
  checkRegex(value: string): boolean {
    return /^[a-z]{2}_[A-Z]{2}(?:_rather|_wwyd|_nhie)?$/.test(value);
  }

  /**
   * Get the language data
   * @param language
   * @return {object}
   * @private
   */
  getLanguage(language: string): object {
    if (!this.checkRegex(language)) return this.translations["en_EN"];
    return this.translations[language];
  }

  /**
   * Add an available language to the languages array
   * @param {string} language
   */
  addLanguage(language: string) {
    if (!this.checkRegex(language)) {
      throw new Error("Invalid language format. Example: en_EN");
    }

    this.availableLanguages.push(language);
  }

  /**
   * Reload the translation handler
   * @return {void}
   */
  reload(): void {
    this.translations = {};
    for (const language of this.availableLanguages) {
      try {
        const data = require(`../languages/${language}.json`);

        if (!data) continue;

        this.initLanguage(language, data);
      } catch (err) {
        captureException(err);
      }
    }
  }

  /**
   * Get a translation from the language file
   * @param {string} language the language key
   * @param {string} path the path to the translation
   * @param {object} data the data to replace in the translation
   * @return {string} the translation
   * @example
   * const translation = getTranslation('en_EN', 'commands.ping.pong', {ping: 100});
   */
  get(
    language: string,
    translationPath: string,
    placeholders: Record<string, any> = {},
  ): string {
    if (!language) language = "en_EN";

    const languageData: Record<string, any> = this.getLanguage(language);
    const pathSegments = translationPath.split(".");
    let currentTranslation = null;

    if (pathSegments.length > 0) {
      for (const segment of pathSegments) {
        try {
          if (!currentTranslation) {
            if (!languageData.hasOwnProperty(segment)) break;
            currentTranslation = languageData[segment];
          } else {
            if (!currentTranslation.hasOwnProperty(segment)) break;
            currentTranslation = currentTranslation[segment];
          }
        } catch (err) {
          captureException(err);
          break;
        }
      }
    } else {
      if (language !== "en_EN") {
        return this.get("en_EN", translationPath, placeholders);
      } else {
        return translationPath;
      }
    }

    if (!currentTranslation) {
      if (language !== "en_EN") {
        // Check if "en_EN" also doesn't have the translation
        const enTranslation = this.get("en_EN", translationPath, placeholders);
        if (enTranslation === translationPath) {
          // If "en_EN" also doesn't have the translation, return the path
          return translationPath;
        } else {
          // If "en_EN" has the translation, return it
          return enTranslation;
        }
      } else {
        return translationPath;
      }
    }

    if (placeholders) {
      return currentTranslation.replace(
        /{(\w+)}/g,
        (match: string, key: string) => placeholders[key] ?? match,
      );
    }

    return currentTranslation;
  }
}
