import type WouldYou from "./wouldYou";

export default class CooldownHandler {
	private client: WouldYou;
	private cooldownSweeperInterval: NodeJS.Timeout;

	constructor(client: WouldYou) {
		this.client = client;
		this.client.used = new Map();
	}

	/**
	 * Start the cooldown sweeper
	 * @private
	 */
	startSweeper() {
		this.cooldownSweeperInterval = setInterval(
			() => {
				for (const [key, value] of this.client.used.entries()) {
					if (value < Date.now()) {
						this.client.used.delete(key);
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
