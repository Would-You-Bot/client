const { readdir } = require("fs");

module.exports = class EventHandler {
  constructor(c) {
    this.c = c;
    this.once = ["ready"];
  }

  /**
   * Load the buttons
   */
  load() {
    readdir("./src/events/", (err, files) => {
      if (err) return console.error(err);

      files.forEach((file) => {
        const event = require(`../events/${file}`);
        let eventName = file.split(".")[0];

        if (this.once.includes(eventName)) {
          this.c.once(eventName, event.bind(null, this.c));
        } else {
          this.c.on(eventName, event.bind(null, this.c));
        }
      });
    });
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
