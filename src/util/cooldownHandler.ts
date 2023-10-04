export default class CooldownHandler {
  private c: any;
  private cooldownSweeperInterval: any = null;

  constructor(c: any) {
    this.c = c;
    this.c.used = new Map();
  }

  /**
   * Start the cooldown sweeper
   * @private
   */
  startSweeper() {
    this.cooldownSweeperInterval = setInterval(
      () => {
        for (const [key, value] of this.c.used.entries()) {
          if (value < Date.now()) {
            this.c.used.delete(key);
          }
        }
      },
      15 * 60 * 1000,
    );
  }

  /**
   * Stop the cooldown sweeper
   * @private
   */
  stopSweeper() {
    return clearInterval(this.cooldownSweeperInterval);
  }
}
