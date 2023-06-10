import {
  CoreCronExecute,
  CoreCronOptions,
  ExportedCoreCron,
} from '@typings/core';

/**
 * The CoreCron class, used to create a Cron.
 */
export default class CoreCron {
  private id: string;
  private name: string;
  private expression: string;
  private timezone: string;
  private disabled?: boolean;
  private executeFunction: CoreCronExecute;

  /**
   * Creates a new CoreCron instance.
   * @param options The options for the Cron.
   * @param options.id The id of the Cron.
   */
  public constructor(options: CoreCronOptions) {
    this.id = options.id;
    this.name = options.name;
    this.expression = options.expression;
    this.timezone = options.timezone;
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
  public export(): ExportedCoreCron {
    return {
      id: this.id,
      name: this.name,
      expression: this.expression,
      timezone: this.timezone,
      disabled: this.disabled,
      execute: this.executeFunction,
    };
  }
}
