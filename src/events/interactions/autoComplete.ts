import { AutocompleteInteraction, Events } from 'discord.js';

import { CoreEvent } from '@typings/core';

export default <CoreEvent>{
  name: Events.InteractionCreate,
  /**
   * Execute the auto complete event handler.
   * @param client The extended client.
   * @param interaction The autocomplete interaction.
   * @returns A promise.
   */
  async execute(client, interaction: AutocompleteInteraction): Promise<unknown> {
    if (!client.synced) return;
    if (!interaction.isAutocomplete()) return;

    // Get the command
    const command = client.slashCommands.get(interaction.commandName);

    // If the command could not be found
    if (!command) {
      client.logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.autocomplete(client, interaction);
    } catch (error) {
      client.logger.error(error);
    }
  },
};