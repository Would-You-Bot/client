import {
  CoreCronExecute,
  CoreCustomCronOptions,
  ExportedCoreCustomCron,
} from '@typings/core';

/**
 * The CoreCron class, used to create a Cron.
 */
export default class CoreCustomCron {
  private id: string;
  private name: string;
  private disabled?: boolean;
  private executeFunction: CoreCronExecute;

  /**
   * Creates a new CoreCron instance.
   * @param options The options for the Cron.
   * @param options.id The id of the Cron.
   */
  public constructor(options: CoreCustomCronOptions) {
    this.id = options.id;
    this.name = options.name;
    this.disabled = options.disabled;
  }

  /**
   * Sets the function to execute when the Cron is pressed.
   * @param callback The callback function to execute when the Cron is pressed.
   */
  public execute(callback: CoreCronExecute): void {
    this.executeFunction = callback;
  }

  /**
   * Gets the exported Cron object.
   * @returns The exported Cron object.
   */
  public export(): ExportedCoreCustomCron {
    return {
      id: this.id,
      name: this.name,
      disabled: this.disabled,
      execute: this.executeFunction,
    };
  }
}
