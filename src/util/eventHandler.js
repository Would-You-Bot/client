const fs = require("fs");
const path = require("path");

module.exports = class EventHandler {
  constructor(c) {
    this.c = c;
    this.once = ["ready"];
  }

  /**
   * Load the events
   */
  load() {
    this.loadFromPath(path.join(__dirname, "../events/"));
  }

  loadFromPath(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.loadFromPath(filePath);
      } else if (file.endsWith(".js")) {
        try {
          const event = require(filePath);
          const eventName = file.split(".js")[0];
          this.once.includes(eventName)
            ? this.c.once(eventName, event.bind(null, this.c))
            : this.c.on(eventName, event.bind(null, this.c));
        } catch(err) {
          console.log(err);
        }
      }
    }
  }

  /**
   * Reload the buttons
   */
  reload() {
    this.c.removeEventListener();
    this.load();

    // This also need to get started because we just removed **all** event listeners
    this.c.keepAlive.start();
  }
};
