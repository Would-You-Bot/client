/**
 * Custom Error message to handle everything related to the queue and the daily message service.
 */
export default class QueueError extends Error {
    public readonly context?: globalThis.CanJSON
    public readonly id?: string
    constructor(message: string, options: { error?: Error, id?: string ,context?: globalThis.CanJSON } = {}) {
      const { error, id, context } = options
      super(message, { cause: error })
      this.name = this.constructor.name
      this.context = context
      this.id = id
    }
  }