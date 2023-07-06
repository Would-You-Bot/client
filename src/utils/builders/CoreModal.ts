import { CoreModalExecute, ExportedCoreModal } from '@typings/core';

interface CoreModalOptions {
  id: string;
  description: string;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

/**
 * The CoreModal class, used to create a Modal.
 */
export default class CoreModal {
  public id: string;
  public description: string;
  public executeFunction: CoreModalExecute;
  public disabled?: boolean;
  public developer?: boolean;
  public perUser?: boolean;

  /**
   * Creates a new CoreModal instance.
   * @param options The options for the Modal.
   * @param options.id The id of the Modal.
   */
  public constructor(options: CoreModalOptions) {
    this.id = options.id;
    this.description = options.description;
    this.disabled = options.disabled;
    this.developer = options.developer;
    this.perUser = options.perUser;
  }

  /**
   * Sets the function to execute when the Modal is pressed.
   * @param callback The callback function to execute when the Modal is pressed.
   * @returns The CoreModal instance.
   */
  public execute(callback: CoreModalExecute): this {
    this.executeFunction = callback;
    return this;
  }

  /**
   * Gets the exported Modal object.
   * @returns The exported Modal object.
   */
  public export(): ExportedCoreModal {
    return {
      id: this.id,
      description: this.description,
      execute: this.executeFunction,
      disabled: this.disabled,
      developer: this.developer,
    };
  }
}
