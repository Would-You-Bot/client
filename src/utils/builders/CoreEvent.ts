import { CoreEventExecute, CoreEventName, CoreEventOptions, ExportedCoreEvent } from '@typings/core';

/**
 * The CoreEvent class, used to create a Event.
 */
export default class CoreEvent {
  private once?: boolean;
  private name: CoreEventName;
  private disabled?: boolean;
  private executeFunction: CoreEventExecute;

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
   */
  public execute(callback: CoreEventExecute): void {
    this.executeFunction = callback;
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
