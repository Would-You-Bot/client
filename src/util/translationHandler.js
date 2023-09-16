const Sentry = require("@sentry/node");

module.exports = class TranslationHandler {
  /**
   * Get a translation from the language file
   * @param {string[]} [languages] the language keys
   */
  constructor(languages) {
    /**
     * The available languages
     * @type {string[]}
     */
    this.availableLanguages = languages ?? ["de_DE", "en_EN", "es_ES", "fr_FR"];

    /**
     * The translations
     * @type {object} translations the translations
     * @private
     */
    this.translations = {};

    // Init default languages
    for (const l of this.availableLanguages) {
      const data = require(`../languages/${l}.json`);
      this.initLanguage(l, data);
    }

    // Init what would you do
    for (const l of this.availableLanguages) {
      const data = require(`../data/wwyd-${l}.json`);
      this.initLanguage(l + "_wwyd", data);
    }

    // Inti rather
    for (const l of this.availableLanguages) {
      const data = require(`../data/rather-${l}.json`);
      this.initLanguage(l + "_rather", data);
    }

    // Init never have I ever
    for (const l of this.availableLanguages) {
      const data = require(`../data/nhie-${l}.json`);
      this.initLanguage(l + "_nhie", data);
    }
  }

  /**
   * Init a language and add it to the translations
   * @param {string} key the language key
   * @param {object} language the language object
   * @return {void}
   * @private
   */
  initLanguage(key, language) {
    this.translations[key] = language;
  }

  /**
   * Check if a key is a valid translation key
   * @param {string} value the value to check
   * @return {boolean} if the value is a valid translation key
   * @private
   */
  checkRegex(value) {
    return /^[a-z]{2}_[A-Z]{2}(?:_rather|_wwyd|_nhie)?$/.test(value);
  }

  /**
   * Get the language data
   * @param language
   * @return {object}
   * @private
   */
  getLanguage(language) {
    if (!this.checkRegex(language)) return this.translations["en_EN"];
    return this.translations[language];
  }

  /**
   * Add an available language to the languages array
   * @param {string} language
   */
  addLanguage(language) {
    if (!this.checkRegex(language)) {
      throw new Error("Invalid language format. Example: en_EN");
    }

    this.availableLanguages.push(language);
  }

  /**
   * Reload the translation handler
   * @return {void}
   */
  reload() {
    this.translations = {};
    for (const l of this.availableLanguages) {
      try {
        const d = require(`../languages/${l}.json`);

        if (!d) continue;

        this.initLanguage(l, d);
      } catch (err) {Sentry.captureException(err);}
    }
  }

  /**
   * Get a translation from the language file
   * @param {string} language the language key
   * @param {string} path the path to the translation
   * @param {object} data the data to replace in the translation
   * @return {string|null} the translation
   * @example
   * const translation = getTranslation('en_EN', 'commands.ping.pong', {ping: 100});
   */
  get(language, path, data = {}) {
    if (!language) language = "en_EN";

    const l = this.getLanguage(language);
    const p = path.split(".");
    let c = null;

    if (p.length > 0) {
      for (const i of p) {
        try {
          if (!c) {
            if (!l.hasOwnProperty(i)) break;
            c = l[i];
          } else {
            if (!c.hasOwnProperty(i)) break;
            c = c[i];
          }
        } catch (err) {
          Sentry.captureException(err);
          break;
        }
      }
    } else {
      return path;
    }

    if (!c) return path;

    if (data) {
      return c.replace(/{(\w+)}/g, (match, key) => data[key] ?? match);
    }

    return c;
  }
};
