import { CoreInterfaceFunction } from '@typings/core';

/**
 * Core Interface, used to create interfaces for interactions.
 */
export default class CoreInterface<T> {
  public execute: CoreInterfaceFunction<T>;

  /**
   * Creates a new instance of the CoreInterface class.
   * @param callback The functions to build the interface.
   */
  public constructor(callback: CoreInterfaceFunction<T>) {
    this.execute = callback;
  }

  /**
   * Builds the interface.
   * @returns The interaction function.
   */
  public build(): CoreInterfaceFunction<T> {
    return this.execute;
  }
}
