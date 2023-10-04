import "dotenv/config";
import Sentry from "@sentry/node";
import WouldYou from "./wouldYou";

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
      Sentry.captureMessage(
        `Rate limited on ${path} with a limit of ${limit} and a timeout of ${timeout}`,
      );
    });

    this.client.on("error", (err) => {
      Sentry.captureException(err);
    });

    this.client.on("warn", async (info) => {
      Sentry.captureMessage(info);
    });

    process.on("unhandledRejection", async (reason) => {
      Sentry.captureException(reason);
    });

    process.on("uncaughtException", async (err) => {
      Sentry.captureException(err);
    });
    process.on("uncaughtExceptionMonitor", async (err) => {
      Sentry.captureException(err);
    });
    process.on("UnhandledPromiseRejection", (err) => {
      Sentry.captureException(err);
    });
  }
}
