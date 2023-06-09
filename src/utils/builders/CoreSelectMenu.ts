import { IExtendedClient } from '@typings/core';
import { SelectMenuInteraction } from 'discord.js';

type SelectMenuFunction = (
  client: IExtendedClient,
  interaction: SelectMenuInteraction,
  args: string[]
) => Promise<unknown> | unknown;

interface ExportedCoreSelectMenu {
  id: string;
  description: string;
  execute: SelectMenuFunction;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

interface CoreSelectMenuOptions {
  id: string;
  description: string;
  disabled?: boolean;
  developer?: boolean;
  perUser?: boolean;
}

/**
 * The CoreSelectMenu class, used to create a SelectMenu.
 */
export default class CoreSelectMenu {
  private id: string;
  private description: string;
  private executeFunction: SelectMenuFunction;
  private disabled?: boolean;
  private developer?: boolean;
  private perUser?: boolean;

  /**
   * Creates a new CoreSelectMenu instance.
   * @param options The options for the SelectMenu.
   * @param options.id The id of the SelectMenu.
   */
  public constructor(options: CoreSelectMenuOptions) {
    this.id = options.id;
    this.description = options.description;
    this.disabled = options.disabled;
    this.developer = options.developer;
    this.perUser = options.perUser;
  }

  /**
   * Sets the function to execute when the SelectMenu is pressed.
   * @param callback The callback function to execute when the SelectMenu is pressed.
   */
  public execute(callback: SelectMenuFunction): void {
    this.executeFunction = callback;
  }

  /**
   * Gets the exported SelectMenu object.
   * @returns The exported SelectMenu object.
   */
  public export(): ExportedCoreSelectMenu {
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
