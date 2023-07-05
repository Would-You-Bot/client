import {
  CoreButtonExecute,
  CoreButtonOptions,
  ExportedCoreButton,
} from '@typings/core';

/**
 * The CoreButton class, used to create a button.
 */
export default class CoreButton {
  public id: string;
  public description: string;
  public executeFunction: CoreButtonExecute;
  public disabled?: boolean;
  public developer?: boolean;
  public perUser?: boolean;
  public errorMessage?: string;

  /**
   * Creates a new CoreButton instance.
   * @param options The options for the button.
   * @param options.id The id of the button.
   * @param options.description The description of the button.
   * @param options.disabled Whether the button is disabled or not.
   * @param options.developer Whether the button is for developers only or not.
   * @param options.perUser Whether the button is per user or not.
   * @param options.errorMessage The message to respond with when an error occurs.
   */
  public constructor(options: CoreButtonOptions) {
    this.id = options.id;
    this.description = options.description;
    this.disabled = options.disabled ?? false;
    this.developer = options.developer ?? false;
    this.perUser = options.perUser ?? false;
    if (options.errorMessage) this.errorMessage = options.errorMessage;
  }

  /**
   * Sets the function to execute when the button is pressed.
   * @param callback The callback function to execute when the button is pressed.
   */
  public execute(callback: CoreButtonExecute): void {
    this.executeFunction = callback;
  }

  /**
   * Gets the exported button object.
   * @returns The exported button object.
   */
  public export(): ExportedCoreButton {
    return {
      id: this.id,
      description: this.description,
      execute: this.executeFunction,
      disabled: this.disabled,
      developer: this.developer,
      perUser: this.perUser,
      errorMessage: this.errorMessage,
    };
  }
}
