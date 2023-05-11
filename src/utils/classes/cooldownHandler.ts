import { ExtendedClient } from 'src/client';

export default class VoteLogger {
  client: ExtendedClient;
  // The sweeper for the cooldown to stop the interval
  cooldownSweeperInterval: NodeJS.Timer = null!;

  constructor(client: ExtendedClient) {
    this.client = client;
  }

  /**
   * Start the cooldown sweeper
   */
  startSweeper() {
    this.cooldownSweeperInterval = setInterval(() => {
      this.client.used.forEach((value: number, key: string) => {
        if (value < Date.now()) {
          this.client.used.delete(key);
        }
      });
    }, 15 * 60 * 1000);
  }

  /**
   * Stop the cooldown sweeper
   * @returns NodeJS.Timer The cooldown sweeper interval
   */
  stopSweeper() {
    return clearInterval(this.cooldownSweeperInterval);
  }
}
