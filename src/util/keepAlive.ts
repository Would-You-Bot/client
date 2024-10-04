import { captureException, captureMessage } from "@sentry/node";
import "dotenv/config";
import type WouldYou from "./wouldYou";

export default class KeepAlive {
	private client: WouldYou;

	constructor(client: WouldYou) {
		this.client = client;
	}

	/**
	 * Start the keep alive system (listener to the process)
	 */
	start() {
		this.client.rest.on("rateLimited", (log) => {
			const { route: path, limit, timeToReset: timeout } = log;
			captureMessage(`Rate limited on ${path} with a limit of ${limit} and a timeout of ${timeout}`);
		});

		this.client.on("error", (err) => {
			captureException(err);
		});

		this.client.on("warn", async (info) => {
			captureMessage(info);
		});

		process.on("unhandledRejection", async (reason) => {
			captureException(reason);
		});

		process.on("uncaughtException", async (err) => {
			captureException(err);
		});
		process.on("uncaughtExceptionMonitor", async (err) => {
			captureException(err);
		});
		process.on("UnhandledPromiseRejection", (err) => {
			captureException(err);
		});
	}
}
