import { readdirSync } from "fs";
import * as path from "path";
import { Collection } from "discord.js";
import { white, gray, green } from "chalk-advanced";
import WouldYou from "./wouldYou";

export default class ButtonHandler {
  private c: WouldYou;

  constructor(c: WouldYou) {
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
      `${white("Would You?")} ${gray(
        ">",
      )} ${green("Successfully loaded buttons")}`,
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
