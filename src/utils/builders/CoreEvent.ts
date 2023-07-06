import {
  CoreEventExecute,
  CoreEventName,
  CoreEventOptions,
  ExportedCoreEvent,
} from '@typings/core';

/**
 * The CoreEvent class, used to create a Event.
 */
export default class CoreEvent {
  public once?: boolean;
  public name: CoreEventName;
  public disabled?: boolean;
  public executeFunction: CoreEventExecute;

  /**
   * Creates a new CoreEvent instance.
   * @param options The options for the Event.
   * @param options.id The id of the Event.
   */
  public constructor(options: CoreEventOptions) {
    this.once = options.once;
    this.name = options.name;
    this.disabled = options.disabled;
  }

  /**
   * Sets the function to execute when the Event is pressed.
   * @param callback The callback function to execute when the Event is pressed.
   * @returns The CoreEvent instance.
   */
  public execute(callback: CoreEventExecute): this {
    this.executeFunction = callback;
    return this;
  }

  /**
   * Gets the exported Event object.
   * @returns The exported Event object.
   */
  public export(): ExportedCoreEvent {
    return {
      once: this.once,
      name: this.name,
      disabled: this.disabled,
      execute: this.executeFunction,
    };
  }
}
