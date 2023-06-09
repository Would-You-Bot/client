import { CoreButtonExecute, CoreButtonOptions, ExportedCoreButton } from '@typings/core';

/**
 * The CoreButton class, used to create a button.
 */
export default class CoreButton {
  private id: string;
  private description: string;
  private executeFunction: CoreButtonExecute;
  private disabled?: boolean;
  private developer?: boolean;
  private perUser?: boolean;

  /**
   * Creates a new CoreButton instance.
   * @param options The options for the button.
   * @param options.id The id of the button.
   */
  public constructor(options: CoreButtonOptions) {
    this.id = options.id;
    this.description = options.description;
    this.disabled = options.disabled;
    this.developer = options.developer;
    this.perUser = options.perUser;
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
    };
  }
}
