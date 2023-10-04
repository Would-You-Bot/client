const fs = require("fs");
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
    console.log(
      `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
        ">",
      )} ${ChalkAdvanced.green("Successfully loaded buttons")}`,
    );
  }

  loadFromPath(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.loadFromPath(filePath);
      } else if (file.endsWith(".js")) {
        const button = require(filePath);
        this.c.buttons.set(button.data.name, button);
      }
    });
  }

  /**
   * Reload the buttons
   */
  reload() {
    this.c.buttons = new Collection();
    this.load();
  }
};
