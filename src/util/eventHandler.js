const { readdir, readdirSync, statSync } = require("fs");
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
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        loadFromPath(path.join(dir, filePath));
      } else {
        let eventName = file.split(".")[0];
        const event = require(`${filePath}`);
        
        if(this.once.includes(eventName)) {
          this.c.once(eventName, event.bind(null, this.c));
        } else {
          this.c.on(eventName, event.bind(null, this.c));
        }
      }
    }
  }

  /**
   * Reload the events
   */
  reload() {
    this.c.removeEventListener();
    this.load();

    // This also need to get started because we just removed **all** event listeners
    this.c.keepAlive.start();
  }
};
