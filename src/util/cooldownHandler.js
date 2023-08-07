module.exports = class VoteLogger {
  constructor(c) {
    this.c = c;
    this.c.used = new Map();
  }

  /**
   * The sweeper for the cooldown to stop the interval
   * @type {number|null}
   * @private
   */
  cooldownSweeperInterval = null;

  /**
   * Start the cooldown sweeper
   * @private
   */
  startSweeper() {
    this.cooldownSweeperInterval = setInterval(
      () => {
        this.c.used.forEach((value, key) => {
          if (value < Date.now()) {
            this.c.used.delete(key);
          }
        });
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
};
