import {
  CoreCommandAutocomplete,
  CoreCommandData,
  CoreCommandExecute,
  CoreCommandOptions,
  ExportedCoreCommand,
} from '@typings/core';

/**
 * The CoreCommand class, used to create a Command.
 */
export default class CoreCommand {
  private data: CoreCommandData;
  private executeFunction: CoreCommandExecute;
  private autocompleteFunction?: CoreCommandAutocomplete;
  private disabled?: boolean;
  private developer?: boolean;

  /**
   * Creates a new CoreCommand instance.
   * @param options The options for the Command.
   * @param options.id The id of the Command.
   */
  public constructor(options: CoreCommandOptions) {
    this.data = options.data;
    this.disabled = options.disabled;
    this.developer = options.developer;
  }

  /**
   * Sets the function to execute when the Command is pressed.
   * @param callback The callback function to execute when the Command is pressed.
   */
  public execute(callback: CoreCommandExecute): void {
    this.executeFunction = callback;
  }

  /**
   * Sets the function to execute when the Command is autocompleting.
   * @param callback The callback function to execute when the Command is autocompleting.
   */
  public autocomplete(callback: CoreCommandAutocomplete): void {
    this.autocompleteFunction = callback;
  }

  /**
   * Gets the exported Command object.
   * @returns The exported Command object.
   */
  public export(): ExportedCoreCommand {
    return {
      data: this.data,
      execute: this.executeFunction,
      autocomplete: this.autocompleteFunction,
      disabled: this.disabled,
      developer: this.developer,
    };
  }
}
