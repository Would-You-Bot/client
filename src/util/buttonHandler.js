const { readdirSync, statSync } = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { ChalkAdvanced } = require("chalk-advanced");

module.exports = class ButtonHandler {
  constructor(c) {
    this.c = c;
    this.c.buttons = new Collection();
  }

  /**
   * Load the buttons
   */
  load() {
    this.loadFromPath(path.join(__dirname, "../buttons/"));
  }

  loadFromPath(dir) {
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        loadFromPath(path.join(dir, filePath));
      } else {
        const button = require(`${filePath}`);
        this.c.buttons.set(button.data.name, button);
      }
    }

    console.log(
      `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
        ">"
      )} ${ChalkAdvanced.green("Successfully loaded buttons")}`
    );
  }

  /**
   * Reload the buttons
   */
  reload() {
    this.c.buttons = new Collection();
    this.load();
  }
};
