const { readdirSync } = require("fs");
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
    for (const file of readdirSync(
      path.join(__dirname, "..", "buttons"),
    ).filter((file) => file.endsWith(".js"))) {
      const button = require(`../buttons/${file}`);
      this.c.buttons.set(button.data.name, button);
    }
    console.log(
      `${ChalkAdvanced.white("Would You?")} ${ChalkAdvanced.gray(
        ">",
      )} ${ChalkAdvanced.green("Successfully loaded buttons")}`,
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
