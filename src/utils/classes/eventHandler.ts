import fs from 'fs';

import { ExtendedClient } from 'src/client';

export default class EventHandler {
  client: ExtendedClient;
  once: string[];

  constructor(client: ExtendedClient) {
    this.client = client;
    this.once = ['ready'];
  }

  /**
   * Load the buttons
   */
  async load() {
    fs.readdir('./src/events/', (err, files) => {
      if (err) return console.error(err);

      files.forEach(async (file) => {
        const event = await import(`../events/${file}`);
        let eventName = file.split('.')[0];

        if (this.once.includes(eventName))
          this.client.once(eventName, event.bind(null, this.client));
        else this.client.on(eventName, event.bind(null, this.client));
      });
    });
  }

  /**
   * Reload the buttons
   */
  reload() {
    this.client.removeAllListeners();
    this.load();
    // This needs to be started, since we removed all event listeners
    this.client.keepAlive.start();
  }
}
