/**
 * Custom Error message to handle everything related to the queue and the daily message service.
 */
export default class QueueError extends Error {
  public readonly context?: globalThis.CanJSON;
  public readonly id?: string;
  public readonly guildId?: string;
  private readonly error?: Error;
  constructor(
    message: string,
    options: {
      error?: Error;
      id?: string;
      guildId?: string;
      context?: globalThis.CanJSON;
    } = {},
  ) {
    const { error, id, context } = options;
    super(message, { cause: error });
    this.name = this.constructor.name;
    this.context = context;
    this.id = id;
    this.guildId = this.guildId;
    this.error = error;
  }
  get causeError() {
    if (this.error) {
      return this.error;
    } else {
      return new Error("QueueError: no cause error provided.");
    }
  }
}
