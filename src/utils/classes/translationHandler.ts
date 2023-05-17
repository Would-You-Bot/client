import fs from 'fs/promises';

import { logger } from '@utils/client';

type Language = Record<string, object>;

/**
 *
 */
export default class TranslationHandler {
  availableLanguages: string[];
  translations: Record<string, Language>;

  /**
   * Get a translation from the language file.
   * @param the Language keys.
   */
  constructor(/* languages: string[] | null */) {
    // this.availableLanguages = languages ?? ['de_DE', 'en_EN', 'es_ES'];
    this.availableLanguages = ['de_DE', 'en_EN', 'es_ES'];
    this.translations = {};

    this.loadLanguages();
  }

  /**
   *
   */
  private async loadLanguages() {
    // Initialize default languages
    for (const lang of this.availableLanguages) {
      try {
        logger.debug(`Importing language: ${lang}`);

        const json = await fs.readFile(
          `./src/constants/languages/${lang}.json`,
          'utf-8'
        );
        const data = JSON.parse(json);
        this.initLanguage(lang, data);
      } catch (error) {
        logger.error(error);
      }
    }

    // Initialize what would you do
    for (const lang of this.availableLanguages) {
      try {
        logger.debug(`Importing language: ${lang}`);

        const json = await fs.readFile(
          `./src/constants/wwyd-${lang}.json`,
          'utf-8'
        );
        const data = JSON.parse(json);
        this.initLanguage(`${lang}_wwyd`, data);
      } catch (error) {
        logger.error(error);
      }
    }

    // Initialize rather
    for (const lang of this.availableLanguages) {
      try {
        logger.debug(`Importing language: ${lang}`);

        const json = await fs.readFile(
          `./src/constants/rather-${lang}.json`,
          'utf-8'
        );
        const data = JSON.parse(json);
        this.initLanguage(`${lang}_rather`, data);
      } catch (error) {
        logger.error(error);
      }
    }

    // Initialize never have I ever
    for (const lang of this.availableLanguages) {
      try {
        logger.debug(`Importing language: ${lang}`);

        const json = await fs.readFile(
          `./src/constants/nhie-${lang}.json`,
          'utf-8'
        );
        const data = JSON.parse(json);
        this.initLanguage(`${lang}_nhie`, data);
      } catch (error) {
        logger.error(error);
      }
    }
  }

  /**
   * Init a language and add it to the translations.
   * @param key The language key.
   * @param language The language object.
   */
  private initLanguage(key: string, language: Language) {
    this.translations[key] = language;
  }

  /**
   * Check if a key is a valid translation key.
   * @param value The value to check.
   * @returns If the value is a valid translation key.
   */
  private static checkRegex(value: string) {
    return /^[a-z]{2}_[A-Z]{2}(?:_rather|_wwyd|_nhie)?$/.test(value);
  }

  /**
   * Get the language data.
   * @param language The language key.
   * @returns The language data.
   */
  private getLanguage(language: string) {
    if (!TranslationHandler.checkRegex(language))
      return this.translations.en_EN;
    return this.translations[language];
  }

  /**
   * Add an available language to the languages array.
   * @param language The language key.
   */
  addLanguage(language: string) {
    if (!TranslationHandler.checkRegex(language))
      throw new Error('Invalid language format. Example: en_EN');

    this.availableLanguages.push(language);
  }

  /**
   * Reload the translation handler.
   */
  async reload() {
    this.translations = {};
    for (const lang of this.availableLanguages) {
      try {
        logger.debug(`Importing language: ${lang}`);

        const json = await fs.readFile(
          `./src/constants/languages/${lang}.json`,
          'utf-8'
        );
        const data = JSON.parse(json);
        if (!data) break;
        this.initLanguage(lang, data);
      } catch (error) {
        logger.error(error);
      }
    }
  }

  /**
   * Get a translation from the language file.
   * @param language The language key.
   * @param path The path to the translation.
   * @param data The data to replace in the translation.
   * @returns The translation which could be string or null.
   * @example const translation = getTranslation('en_EN', 'commands.ping.pong', {ping: 100});
   */
  get(
    language: string,
    path: string,
    data: Record<string, string> = {}
  ): string {
    if (!language) language = 'en_EN';

    const lang = this.getLanguage(language);
    const paths = path.split('.');
    let cmd: null | Record<string, string> | object | string | any = null;

    if (paths.length > 0) {
      for (const i of paths) {
        try {
          if (!cmd) {
            if (!(i in lang)) break;
            cmd = lang[i];
          } else {
            if (!(i in cmd)) break;
            cmd = cmd[i];
          }
        } catch (err) {
          break;
        }
      }
    } else return path;

    if (!cmd) return path;

    if (data && typeof cmd === 'string') {
      return cmd.replace(
        /{(\w+)}/g,
        (match: string, key: string) => data[key] ?? match
      );
    }

    return cmd.toString();
  }
}
